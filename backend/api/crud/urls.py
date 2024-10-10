from django.urls import path
from .views import CRUD

urlpatterns = [
    path('create/', CRUD.create, name='create_user'),
    path('get/<int:user_id>/', CRUD.read, name='read_user'),
    path('update/<int:user_id>/', CRUD.update, name='update_user'),
    path('delete/<int:user_id>/', CRUD.delete, name='delete_user'),
]
