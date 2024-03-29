from rest_framework_nested import routers

from .views import UserViewSet
from post.views import PostViewSet
from comment.views import CommentViewSet
from chat.views import ChatViewSet, MessageViewSet


router = routers.SimpleRouter()
router.register('users', UserViewSet, basename='users')
router.register('post', PostViewSet, basename='post')
router.register('chats', ChatViewSet, basename='chats')
router.register('comments', CommentViewSet, basename='')

posts_router = routers.NestedSimpleRouter(router, r'post', lookup='post')
posts_router.register(r'comment', CommentViewSet, basename='post-comment')

chats_router = routers.NestedSimpleRouter(router, r'chats', lookup='chats')
chats_router.register(r'message', MessageViewSet, basename='chat-message')

urlpatterns = [
    *router.urls,
    *posts_router.urls,
    *chats_router.urls,
]
