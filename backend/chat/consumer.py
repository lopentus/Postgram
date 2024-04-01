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
        message = Message.objects.create(
            chat = Chat.objects.get_object_by_public_id(public_id=self.room_group_name.split('_')[1]),
            sender = self.user,
            body = message,
        )
        message_created_time = message.created
        return message_created_time

    @database_sync_to_async
    def fetch_messages(self, msg_counter):
        last_counter = 20 * msg_counter
        first_counter = last_counter - 20
        json_messages = []
        chat_messages = self.chat.messages.order_by('-created').all()[first_counter:last_counter]
        for chat_message in chat_messages:
            json_messages.append(
                {
                    'message': chat_message.body,
                    'sender': chat_message.sender.username,
                    'created': chat_message.created.strftime('%d-%m-%Y, %H:%M'),
                    # edited
                }
            )

        print(json_messages, 'PRINTED')
        return json_messages[::-1]

    async def send_fetched_messages(self, msg_counter):
        messages = await self.fetch_messages(msg_counter)
        print(messages)
        await self.send(text_data=json.dumps({'message': messages}))

    commands = {
        'fetch_messages': send_fetched_messages,
    }

    async def connect(self):
        self.room_group_name = None
        self.user = self.scope['user']
        self.room_name = self.scope['url_route']['kwargs']['room_name']

        self.chat = (await self.get_chat(self.room_name))
        chat_public_id = self.chat.public_id
        self.room_group_name = f'chat_{chat_public_id}'
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        # await self.fetch_messages()
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json, '----------------------------')
        try:
            print(text_data_json, 'text_data_json')
            message = text_data_json['message']
            message_created_time = await self.save_message(message=message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {
                    'type': 'chat.message',
                    'message': message,
                    'sender': self.user.username,
                    'created': f'{message_created_time.strftime("%d-%m-%Y, %H:%M")}'
                }
            )
            print(message)
        except KeyError:
            print(self.commands[text_data_json['command']], '------------')
            msg_counter = int(text_data_json['msg_counter'])
            await self.commands[text_data_json['command']](self, msg_counter)
        # print(message)

    async def send_message(self, message):
        print(message, 'message')
        await self.send(text_data=json.dumps({'message': message}))

    # Receive message from room group
    async def chat_message(self, event):
        # message = event['message']
        # message_data = event.pop('type')

        # Send message to WebSocket
        await self.send_message(message=event)
