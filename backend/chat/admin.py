from django.contrib import admin

from .models import Chat, Message


class ChatPageAdmin(admin.ModelAdmin):
    readonly_fields = ('created',)
    fields = ['participants', 'created']
    list_display = ('public_id', 'display_messages', 'created')

    def display_messages(self, obj):
        messages = Message.objects.filter(chat=obj)
        return ', '.join([message.body for message in messages])


admin.site.register(Chat, ChatPageAdmin)
admin.site.register(Message)
