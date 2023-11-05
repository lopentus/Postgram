from django.conf import settings
from rest_framework import serializers

from .models import User
from core.abstract.serializers import AbstractSerializer


class UserSerializer(AbstractSerializer):
    bio = serializers.CharField(allow_null=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'bio',
            'avatar',
            'email',
            'is_active',
            'created',
            'updated',
        ]
        read_only_field = ['is_active']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        print(rep['avatar'], '102')
        if not rep['avatar']:
            rep['avatar'] = settings.DEFAULT_AVATAR_URL
            return rep

        if settings.DEBUG:
            request = self.context.get('request', None)
            if request:
                rep['avatar'] = request.build_absolute_uri(
                    rep['avatar']
                )
        return rep
