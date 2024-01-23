from urllib.parse import parse_qs

from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from channels.auth import AuthMiddlewareStack
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from jwt import decode as jwt_decode

from postgram import settings


User = get_user_model()


@database_sync_to_async
def get_user(validated_token):
    try:
        user = User.objects.get(id=validated_token['user_id'])
        print(user)
        return user
    except User.DoesNotExist:
        return AnonymousUser()


class CustomAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # print(scope)
        token = parse_qs(scope['query_string'].decode('utf8'))['token'][0]
        print(token)

        try:
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            print(e)
            return None
        else:
            decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print(decoded_data)

            scope['user'] = await get_user(validated_token=decoded_data)
            print(scope['user'])

        return await super().__call__(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return CustomAuthMiddleware(AuthMiddlewareStack(inner))
