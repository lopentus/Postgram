from rest_framework import serializers

from core.user.serializers import UserSerializer
from core.user.models import User


class RegisterSerializer(UserSerializer):
    """Registration serializer for requests and user creation"""
    password = serializers.CharField(max_length=128, min_length=8, write_only=True, required=True)
    bio = serializers.CharField(allow_null=True, required=False)
    avatar = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'bio',
            'avatar',
            'email',
            'username',
            'first_name',
            'last_name',
            'password'
        )

    def create(self, validated_data):
        # use the 'create_user' custom method
        return User.objects.create_user(**validated_data)
