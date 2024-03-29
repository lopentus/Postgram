import json

from django.http import Http404
from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
# from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Chat, Message


class ChatConsumer(AsyncWebsocketConsumer):
    # connect to db and check if chat exists
    @database_sync_to_async
    def get_chat(self, public_id):
        try:
            return Chat.objects.get_object_by_public_id(public_id=public_id)
        except Exception:
            # print('denied')
            self.close()
            raise DenyConnection('Invalid Chat')

    @database_sync_to_async
    def save_message(self, message):
        Message.objects.create(
            chat = Chat.objects.get_object_by_public_id(public_id=self.room_group_name.split('_')[1]),
            sender = self.user,
            body = message,
        )

    async def connect(self):
        # print(self.scope)
        self.room_group_name = None
        self.user = self.scope['user']
        # print(self.user, 'user')
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        # print(self.room_name)

        chat_public_id = (await self.get_chat(self.room_name)).public_id
        # print(chat_public_id, 'chat')
        self.room_group_name = f'chat_{chat_public_id}'
        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
        # else:
        #     print('close')
        #     await self.close()

    async def disconnect(self, close_code):
        # Leave room group
        if self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        # print(message)

        await self.save_message(message=message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                'type': 'chat.message',
                'message': message,
            }
        )
        print(message)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        # print(event)
        # await self.send(text_data=json.dumps({'message': message}))
        await self.send(text_data=json.dumps({'message': message}))
        print(message)
