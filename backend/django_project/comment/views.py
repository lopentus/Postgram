from django.http.response import Http404
from django.core.cache import cache

from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from core.abstract.views import AbstractViewSet
from core.auth.permissions import UserPermission
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (UserPermission,)
    serializer_class = CommentSerializer

    def list(self, request, *args, **kwargs):
        post_pk = self.kwargs.get('post_pk')
        print(post_pk)
        comment_objects = cache.get('comment_objects')
        print(cache.get(f'comment_objects_{post_pk}'), 3)

        if not comment_objects:
            comment_objects = self.filter_queryset(self.get_queryset())
            cache.set(f'comment_objects_{post_pk}', comment_objects)

        page = self.paginate_queryset(comment_objects)
        if page:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(comment_objects, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        if self.request.user.is_superuser:
            return Comment.objects.all()

        post_pk = self.kwargs['post_pk']
        if post_pk is None:
            return Http404

        queryset = Comment.objects.filter(post__public_id=post_pk)

        return queryset

    def get_object(self):
        obj = Comment.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)

        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['post'], detail=True)
    def like_comment(self, request, *args, **kwargs):
        user = self.request.user
        comment = self.get_object()

        user.like_comment(comment)

        serializer = self.serializer_class(comment)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def remove_like_comment(self, request, *args, **kwargs):
        comment = self.get_object()
        user = self.request.user

        user.remove_like_comment(comment)

        serializer = self.serializer_class(comment)

        return Response(serializer.data, status=status.HTTP_200_OK)