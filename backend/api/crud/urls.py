from django.urls import path
from .views import USER, POST, COMMENT

urlpatterns = [
    path('create/', USER.create, name='create_user'),
    path('get/<int:user_id>/', USER.read, name='read_user'),
    path('login/<username>/', USER.login, name='read_user'),
    path('update/<int:user_id>/', USER.update, name='update_user'),
    path('delete/<int:user_id>/', USER.delete, name='delete_user'),
    path('reset/<int:user_id>/', USER.reset_avatar, name='reset_avatar'),
    path('search/<start>/', USER.search, name='search'),
    path('follow/<int:user_id>/<int:follow_id>/', USER.follow, name='follow'),
    path('unfollow/<int:user_id>/<int:follow_id>/', USER.unfollow, name='unfollow'),
    path('create_post/<int:user_id>/', POST.create_post, name='create_post'),
    path('get_posts/<int:user_id>/', POST.get_posts, name='get_posts'),
    path('get_post/<int:user_id>/<int:post_id>/', POST.get_post, name='get_post'),
    path('get_all_posts/<int:user_id>/', POST.get_all_posts, name='get_all_post'),
    path('del_post/<int:user_id>/<int:post_id>/', POST.del_post, name="del_post"),
    path('like/<int:user_id>/<int:post_id>/', POST.like, name="like"),
    path('dislike/<int:user_id>/<int:post_id>/', POST.dislike, name="dislike"),
    path('get_comments/<int:post_id>/', COMMENT.get_comments, name="get_comments"),
    path('create_comment/<int:post_id>/<int:user_id>/', COMMENT.comment, name="comment"),
    path('edit_comment/<int:comment_id>/', COMMENT.edit_comment, name="edit_comment"),
    path('delete_comment/<int:comment_id>/', COMMENT.delete_comment, name="delete_comment"),
]
