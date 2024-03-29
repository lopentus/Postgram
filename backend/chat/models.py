from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models

from abstract.models import AbstractModel, AbstractManager


User = get_user_model()


class ChatManager(AbstractManager):
    pass


class Chat(AbstractModel):
    name = models.CharField()
    participants = models.ManyToManyField(
        User,
        related_name='chats',
    )

    objects = ChatManager()

    # def __str__(self):
    #     chat_users = [user.username for user in self.participants.all()]
    #     return f'Chat {self.public_id} with {", ".join(chat_users)}'

    def __str__(self):
        return f'Chat: {self.public_id}'

    class Meta:
        db_table = '"chat"'


class MessageManager(AbstractManager):
    pass


class Message(AbstractModel):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.DO_NOTHING)
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.DO_NOTHING)
    body = models.TextField()
    edited = models.BooleanField(default=False)

    objects = MessageManager()

    def __str__(self):
        return f'message {self.body} from {self.sender} in chat {self.chat}'

    class Meta:
        db_table = '"message"'
