import uuid

from django.db import models
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404


def _delete_cached_objects(app_label):
    print(app_label)
    if app_label == 'post':
        cache.delete('post_objects')
    elif app_label == 'comment':
        cache.delete('comment_objects')
    else:
        raise NotImplementedError


class AbstractManager(models.Manager):
    def get_object_by_public_id(self, public_id):
        try:
            instance = self.get(public_id=public_id)
            return instance
        except (ObjectDoesNotExist, ValueError, TypeError):
            # return Http404
            raise Http404


class AbstractModel(models.Model):
    public_id = models.UUIDField(db_index=True, unique=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    objects = AbstractManager()

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        app_label = self._meta.app_label
        print(app_label)
        if app_label in ['post', 'comment']:
            _delete_cached_objects(app_label)
        return super(AbstractModel, self).save(
            force_insert=force_insert,
            force_update=force_update,
            using=using,
            update_fields=update_fields
        )

    def delete(self, using=None, keep_parents=False):
        app_label = self._meta.app_label
        if app_label in ['post', 'comment']:
            _delete_cached_objects(app_label)
        return super(AbstractModel, self).delete(
            using=using,
            keep_parents=keep_parents
        )

    class Meta:
        abstract = True
