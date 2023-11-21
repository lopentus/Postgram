import pytest

from fixtures.user import user
from fixtures.post import post
from comment.models import Comment


@pytest.mark.django_db
def test_create_comment(user, post):
    comment = Comment.objects.create(author=user, post=post, body='Test Comment body')
    assert comment.author == user
    assert comment.post == post
    assert comment.body == 'Test Comment body'
