import pytest

from fixtures.user import user
from fixtures.post import post

from comment.models import Comment


@pytest.fixture
def comment(db, user, post):
    return Comment.objects.create(author=user, post=post, body='test comment body')
