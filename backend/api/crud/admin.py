from django.contrib import admin
from .models import User, Post, Comment
from django.contrib.admin.sites import AlreadyRegistered

admin.site.register(User)

try:
    admin.site.register(Post)
except AlreadyRegistered:
    pass  

admin.site.register(Comment)
