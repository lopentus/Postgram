from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from abstract.serializers import AbstractSerializer
from .models import Chat, Message


User = get_user_model()


# Chat serializer
class ChatSerializer(AbstractSerializer):
    name = serializers.StringRelatedField(many=True, read_only=True)

    def validate_participants(self, value):
        if self.context['request'].user not in value:
            raise ValidationError("You can't create a chat for another user.")

        if len(set(value)) < 2:
            raise ValidationError("You can't create chat with yourself only.")

        chats = Chat.objects.annotate(participants_count=Count('participants'))
        chats = chats.filter(participants_count=len(value))

        for chat in chats:
            if set(chat.participants.all()) == set(value):
                raise ValidationError(f'chat {chat.public_id} already exists.')

        return value

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        participants = rep['participants']
        users = User.objects.filter(pk__in=participants)
        user_data = [{'id': user.public_id, 'username': user.username} for user in users]
        rep['participants'] = user_data

        print(user_data)

        return rep

    class Meta:
        model = Chat
        fields = '__all__'


class MessageSerializer(AbstractSerializer):
    sender = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = '__all__'
