import datetime
import json

from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    # connect to db and check if chat exists
    @database_sync_to_async
    def get_chat(self, public_id):
        try:
            return Chat.objects.get_object_by_public_id(public_id=public_id)
        except Exception:
            self.close()
            raise DenyConnection('Invalid Chat')

    @database_sync_to_async
    def save_message(self, message):
        self.saved_messages_counter += 1

        message = Message.objects.create(
            chat = Chat.objects.get_object_by_public_id(public_id=self.room_group_name.split('_')[1]),
            sender = self.user,
            body = message,
        )
        message_created_time = message.created
        message_public_id = message.public_id
        return message_created_time, message_public_id

    @database_sync_to_async
    def fetch_messages(self, data):
        msg_counter = int(data['msg_counter'])
        last_counter = 20 * msg_counter + self.saved_messages_counter
        first_counter = last_counter - 20
        json_messages = []
        chat_messages = self.chat.messages.order_by('-created').all()[first_counter:last_counter]
        for chat_message in chat_messages:
            json_messages.append(
                {
                    'public_id': chat_message.public_id.hex,
                    'message': chat_message.body,
                    'sender': chat_message.sender.username,
                    'created': chat_message.created.strftime('%d-%m-%Y, %H:%M'),
                    # edited
                }
            )

        return json_messages

    @database_sync_to_async
    def fetch_receiver(self):
        chat = Chat.objects.get_object_by_public_id(public_id=self.room_group_name.split('_')[1])
        participants = chat.participants.all()
        receiver = [participant for participant in participants if self.user.public_id != participant.public_id][0]
        return receiver

    async def send_message(self, message_data):
        message = message_data['message']
        save_message_and_receive_message_created_time_and_public_id = await self.save_message(message=message)

        message_data = {
            'public_id': save_message_and_receive_message_created_time_and_public_id[1].hex,
            'message': message,
            'sender': self.user.username,
            'created': f'{save_message_and_receive_message_created_time_and_public_id[0].strftime("%d-%m-%Y, %H:%M")}'
        }
        return await self.send_chat_message(message_data)

    async def send_fetched_messages(self, data):
        messages = await self.fetch_messages(data)
        await self.send(text_data=json.dumps({'message': messages}))

    async def send_receiver(self, command):
        receiver = await self.fetch_receiver()
        receiver_data = {
            'command': command['command'],
            'public_id': receiver.public_id.hex,
            'username': receiver.username
        }
        await self.send(text_data=json.dumps({'receiver_data': receiver_data}))

    commands = {
        'send_message': send_message,
        'fetch_messages': send_fetched_messages,
        'fetch_receiver': send_receiver,
    }

    async def connect(self):
        self.room_group_name = None
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        self.saved_messages_counter = 0

        self.chat = (await self.get_chat(self.room_name))
        chat_public_id = self.chat.public_id
        self.room_group_name = f'chat_{chat_public_id}'
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.commands[data['command']](self, data)

    async def send_chat_message(self, message_data):
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'chat.message',
                'message': message_data,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))
