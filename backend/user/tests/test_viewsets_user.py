from rest_framework import status

from fixtures.user import user


class TestUserViewSet:
    endpoint = '/api/users/'

    def test_list(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['count'] == 1

    def test_retrieve(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint + str(user.public_id) + '/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user.public_id.hex
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email
        assert response.data['first_name'] == user.first_name
        assert response.data['last_name'] == user.last_name

    def test_create(self, client, user):
        client.force_authenticate(user=user)
        data = {}
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_405_METHOD_NOT_ALLOWED

    def test_update(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "username": "test_user_updated",
            "email": "test_updated@gmail.com",
            "first_name": "Test_updated",
            "last_name": "User",
            "password": "test_password_updated"
        }
        response = client.patch(self.endpoint + str(user.public_id) + '/', data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == data['username']
        assert response.data['email'] == data['email']
        assert response.data['first_name'] == data['first_name']
        assert response.data['last_name'] == data['last_name']
