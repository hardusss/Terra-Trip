from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import segno
import os


class User(models.Model):
    user_id = models.AutoField(primary_key=True, unique=True)
    avatar = models.ImageField(upload_to='images/', default='images/default.png')
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    about = models.CharField(max_length=120, null=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    country = models.CharField(max_length=150)
    post_count = models.IntegerField(default=0)
    readers_count = models.IntegerField(default=0)
    follows_count = models.IntegerField(default=0)
    follow_for = models.JSONField(blank=True, null=True, default=list)
    liked_posts = models.JSONField(blank=True, null=True, default=list)
    official = models.BooleanField(default=False, null=True)

    def __str__(self):
        return self.username

    def generate_qr_code(self):
        qr_filename = f"qr_user_{self.user_id}.png"
        qr_path = os.path.join('media', 'qr_codes', qr_filename)
        qrcode = segno.make_qr(f"http://127.0.0.1:300/user/{self.user_id}")
        qrcode.save(qr_path, scale=5)
        self.qr_code = f'qr_codes/{qr_filename}'


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField(null=True, default="")
    image = models.ImageField(upload_to='posts/', blank=True, null=False)
    geolocation = models.CharField(max_length=155, null=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    likes_count = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Post by {self.user.username}'


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.post.id}'

@receiver(post_save, sender=User)
def create_qr_code(sender, instance, created, **kwargs):
    if created and not instance.qr_code:
        instance.generate_qr_code()
        instance.save()




