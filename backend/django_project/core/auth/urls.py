from rest_framework import routers

from .views.register import RegisterViewSet
from .views.login import LoginViewSet
from .views.refresh import RefreshViewSet
from .views.logout import LogoutViewSet


router = routers.SimpleRouter()
router.register('register', RegisterViewSet, basename='auth-register')
router.register('login', LoginViewSet, basename='auth-login')
router.register('refresh', RefreshViewSet, basename='auth-refresh')
router.register('logout', LogoutViewSet, basename='auth-logout')

urlpatterns = router.urls
