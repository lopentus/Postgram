from rest_framework_nested import routers

from .views import UserViewSet
from post.views import PostViewSet
from comment.views import CommentViewSet


router = routers.SimpleRouter()
router.register('users', UserViewSet, basename='users')
router.register('post', PostViewSet, basename='post')

posts_router = routers.NestedSimpleRouter(router, r'post', lookup='post')
posts_router.register(r'comment', CommentViewSet, basename='post-comment')

urlpatterns = [
    *router.urls,
    *posts_router.urls
]
