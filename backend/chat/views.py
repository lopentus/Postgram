from django.shortcuts import get_list_or_404
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status

from auth.permissions import UserPermission
from abstract.views import AbstractViewSet
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer


User = get_user_model()


class ChatViewSet(AbstractViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = (UserPermission,)

    def get_queryset(self):
        # filter chat list by user
        user = self.request.user
        return Chat.objects.filter(participants=user)

    def get_object(self):
        obj = Chat.objects.get_object_by_public_id(self.kwargs['pk'])
        print(obj, 'obj')
        self.check_object_permissions(self.request, obj)

        return obj

    def list(self, request, *args, **kwargs):
        chat_objects = self.filter_queryset(self.get_queryset())
        # print(chat_objects)
        serializer = self.get_serializer(chat_objects, many=True)
        # print(serializer.data[0]['participants'])
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        participants_public_ids = request.data.get('participants', [])
        participants = get_list_or_404(User, public_id__in=participants_public_ids)
        request.data['participants'] = [user.pk for user in participants]
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageViewSet(AbstractViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    # permission_classes = (UserPermission,)

    def get_queryset(self):
        print(self.kwargs)
        chat_pk = self.kwargs['chats_pk']
        print(chat_pk)

        queryset = Message.objects.filter(chat__public_id=chat_pk)
        print(queryset)
        return queryset

    def get_object(self):
        obj = Message.objects.get_object_by_public_id(self.kwargs['pk'])
        print(obj, 'obj')
        self.check_object_permissions(self.request, obj)

        return obj
