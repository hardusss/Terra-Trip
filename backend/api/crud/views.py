import json

from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Post, Comment
from django.contrib.auth.hashers import check_password


class USER:
    @csrf_exempt
    @staticmethod
    def create(request) -> JsonResponse:
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                username = data.get('username')
                user_email = data.get('user_email')
                password = data.get('password')
                country = data.get('country')

                if not username:
                    return JsonResponse({'error': 'Username is required'}, status=400)
                if not user_email:
                    return JsonResponse({'error': 'User email is required'}, status=400)
                if not password:
                    return JsonResponse({'error': 'Password is required'}, status=400)

                if not country:
                    return JsonResponse({'error': 'Country is required'}, status=400)

                user = User(username=username, password=make_password(password), email=user_email, country=country)
                user.save()

                return JsonResponse({'message': 'User created successfully.', 'user_id': user.user_id}, status=201)
            except Exception as e:
                return JsonResponse({'error': f'Invalid request data: {str(e)}'}, status=400)

        return JsonResponse({'error': 'Invalid HTTP method. Only POST allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def read(request, user_id) -> JsonResponse:
        if request.method == 'GET':
            try:
                user = User.objects.get(user_id=user_id)
                return JsonResponse({
                    'username': user.username,
                    'email': user.email,
                    'country': user.country,
                    "about": user.about,
                    "avatar": str(user.avatar),
                    "post_count": user.post_count,
                    "readers": user.readers_count,
                    "follows": user.follows_count,
                    "follow_for": user.follow_for,
                    "qr": str(user.qr_code),
                    "liked_posts": user.liked_posts,
                    "official": str(user.official)
                }, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'error': 'Invalid HTTP method. Only GET allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def login(request, username) -> JsonResponse:
        if request.method == 'POST':
            data = json.loads(request.body)
            password: str = data.get("password")
            email: str = data.get("email")
            try:
                user = User.objects.get(username=username)
                if check_password(password, user.password) != True:
                    return JsonResponse({"error": "Incorrect password!"})
                if email != user.email:
                    return JsonResponse({"error": "Incorrect email!"})
                if email == user.email and check_password(password, user.password):
                    return JsonResponse({"login": "success", "id": user.user_id, "status": 200})

            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'error': 'Invalid HTTP method. Only GET allowed.'}, status=405)
    @csrf_exempt
    @staticmethod
    def update(request, user_id) -> JsonResponse:
        if request.method == 'POST':
            try:
                user = User.objects.get(user_id=user_id)

                avatar = request.FILES.get('avatar')

                username: str = request.POST.get('username')
                email: str = request.POST.get('email')
                about: str = request.POST.get('about')

                if avatar:
                    user.avatar = avatar
                if username and username != user.username and username.strip() != '':
                    user.username = username

                if email and email != user.email and email.strip() != '':
                    user.email = email

                if about and about != user.about and about.strip() != '':
                    user.about = about

                if about is None:
                    user.about = user.about

                user.save()

                return JsonResponse({'message': 'User updated successfully.'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            except Exception as e:
                return JsonResponse({'error': f'Invalid request data: {str(e)}'}, status=400)

        return JsonResponse({'error': 'Invalid HTTP method. Only PUT allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def delete(request, user_id) -> JsonResponse:
        if request.method == 'DELETE':
            try:
                user = User.objects.get(user_id=user_id)
                user.delete()
                return JsonResponse({'message': 'User deleted successfully.'}, status=204)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'error': 'Invalid HTTP method. Only DELETE allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def reset_avatar(request, user_id) -> JsonResponse:
        if request.method == 'POST':
            try:
                user = User.objects.get(user_id=user_id)
                user.avatar = "images/default.png"
                user.save()

                return JsonResponse({'message': 'Avatar reset successfully.'}, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
            except Exception as e:
                return JsonResponse({'error': f'Invalid request data: {str(e)}'}, status=400)

        return JsonResponse({'error': 'Invalid HTTP method. Only POST allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def search(request, start: str) -> JsonResponse:
        start = start.lower()
        if request.method == 'GET':
            try:
                users = User.objects.all()
                users_list: list[dict[str, str]] = []
                for user in users:
                    if start in user.username.lower():
                        users_list.append({
                            'id': user.user_id,
                            'username': user.username,
                            'avatar': str(user.avatar),
                            'country': user.country,
                            "official": str(user.official)
                        })
                        users_list_sorted = sorted(users_list, key=lambda x: x['username'])
                return JsonResponse({"users": users_list_sorted})
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        return JsonResponse({"error": "Invalid method"}, status=405)

    @csrf_exempt
    @staticmethod
    def follow(request, user_id: int, follow_id: int) -> JsonResponse:
        if request.method == 'POST':
            try:
                user = User.objects.get(user_id=user_id)
                follow = User.objects.get(user_id=follow_id)
                if user.follow_for is None:
                    user.follow_for = []

                if follow_id not in user.follow_for:
                    user.follow_for.append(follow_id)
                    user.follows_count += 1
                    user.save()

                    follow.readers_count += 1
                    follow.save()
                return JsonResponse({"message": "Followed successfully."}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)
        return JsonResponse({"error": "Invalid method"}, status=405)

    @csrf_exempt
    @staticmethod
    def unfollow(request, user_id: int, follow_id: int) -> JsonResponse:
        if request.method == 'POST':
            try:
                user = User.objects.get(user_id=user_id)
                follow = User.objects.get(user_id=follow_id)
                if user.follow_for is not None:
                    if follow_id in user.follow_for:
                        user.follow_for.remove(follow_id)
                        user.follows_count -= 1
                        user.save()

                        follow.readers_count -= 1
                        follow.save()
                return JsonResponse({"message": "Unfollowed successfully."}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found."}, status=404)
        return JsonResponse({"error": "Invalid method"}, status=405)

                
class POST:
    @csrf_exempt
    @staticmethod
    def create_post(request, user_id: int) -> JsonResponse:
        user = User.objects.get(user_id=user_id)

        if request.method == 'POST':
            post_image = request.FILES.get("post")
            about = request.POST.get("about")
            geo = request.POST.get("geo")

            if not post_image:
                return JsonResponse({"error": "Image is required"}, status=400)

            post = Post(user=user, image=post_image, content=about or "", geolocation=geo or "")
            user.post_count += 1
            user.save()
            post.save()

            return JsonResponse({"success": "Post created"}, status=200)

        return JsonResponse({"error": "Invalid request method"}, status=405)

    @csrf_exempt
    @staticmethod
    def get_posts(request, user_id: int) -> JsonResponse:
        if request.method == "GET":
            try:
                user = User.objects.get(user_id=user_id)
                posts = Post.objects.filter(user=user).order_by("-created_at")
                posts_list = []
                for post in posts:
                    liked = user.liked_posts
                                        
                    if liked is None:
                        liked = [] 
                    posts_list.append({
                        "id": post.id,
                        "user_id": post.user.user_id,
                        "username": post.user.username,
                        "avatar": str(post.user.avatar),
                        "content": post.content,
                        "image": str(post.image),
                        "geolocation": post.geolocation,
                        "likes": post.likes_count,
                        "liked": str( post.id in liked),
                        "created_at": post.created_at,
                        "official": str(post.user.official),
                    })
                return JsonResponse({"posts": posts_list}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)

    @csrf_exempt
    @staticmethod
    def get_all_posts(request, user_id: int) -> JsonResponse:
        if request.method == "GET":
            try:
                posts = Post.objects.all().order_by("-created_at")
                user = User.objects.get(user_id=user_id)
                posts_list = []
                for post in posts:
                    liked = user.liked_posts
                    if post.user.user_id != user_id:
                        posts_list.append({
                            "id": post.id,
                            "user_id": post.user.user_id,
                            "username": post.user.username,
                            "avatar": str(post.user.avatar),
                            "content": post.content,
                            "image": str(post.image),
                            "geolocation": post.geolocation,
                            "created_at": post.created_at,
                            "likes": post.likes_count,
                            "liked": str( post.id in liked),
                            "official": str(post.user.official),
                        })
                return JsonResponse({"posts": posts_list}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
    
    @csrf_exempt
    @staticmethod
    def get_post(request, user_id:int, post_id: int) -> JsonResponse:
        if request.method == "GET":
            try:
                post = Post.objects.get(id=post_id)
                user = User.objects.get(user_id=user_id)

                liked = user.liked_posts
                data = {
                    "id": post.id,
                    "user_id": post.user.user_id,
                    "username": post.user.username,
                    "avatar": str(post.user.avatar),
                    "content": post.content,
                    "image": str(post.image),
                    "geolocation": post.geolocation,
                    "created_at": post.created_at,
                    "likes": post.likes_count,
                    "liked": str( post.id in liked),
                    "official": str(post.user.official),
                }
                return JsonResponse({"post": data}, status=200)
            except User.DoesNotExist:
                return JsonResponse({"error": "User not found"}, status=404)
    
    @csrf_exempt
    @staticmethod
    def del_post(request,user_id: int, post_id: int) -> JsonResponse:
        if request.method == "DELETE":
            try:
                post = Post.objects.get(id=post_id)
                user = User.objects.get(user_id=user_id)
                user.post_count -= 1
                user.save()
                post.delete()
                return JsonResponse({"data": "Post deleted success!"}, status=200)
            except:
                return JsonResponse({"error": "Post not found"}, status=404)
        
    @csrf_exempt
    @staticmethod
    def like(request, user_id: int, post_id: int) -> JsonResponse:
        if request.method == "POST":
            try:
                user = User.objects.get(user_id=user_id)
                post = Post.objects.get(id=post_id)
                if user.liked_posts is None:
                    user.liked_posts = []
                if post_id not in user.liked_posts:
                    post.likes_count += 1
                    user.liked_posts.append(post_id)
                    

                    post.save()
                    user.save()

                    return JsonResponse({"status": "success"}, status=200)
                else:
                    return JsonResponse({"error": "Post already liked"}, status=400)
                
            except Post.DoesNotExist:
                return JsonResponse({"error": "Post not found"}, status=404)
        return JsonResponse({"error": "Invalid request method"}, status=405)
    
    @csrf_exempt
    @staticmethod
    def dislike(request, user_id: int, post_id: int) -> JsonResponse:
        if request.method == "POST":
            user = User.objects.get(user_id=user_id)
            post = Post.objects.get(id=post_id)
            post.likes_count -= 1
            user.liked_posts.remove(post_id)
            post.save()
            user.save()
            return JsonResponse({"status": "success"}, status=200)
        

class COMMENT:
    @csrf_exempt
    @staticmethod
    def get_comments(request, post_id: int) -> JsonResponse:
        if request.method == "GET":
            try:
                comments = Comment.objects.filter(post__id=post_id)
                if comments.exists():
                    comments_data = [{"content": comment.content, "avatar": str(comment.user.avatar), "username": comment.user.username, "id": comment.id, "user_id": comment.user.user_id, "official": str(comment.user.official), "created_at": comment.created_at} for comment in comments]
                    return JsonResponse({"comments": comments_data}, status=200)
                else:
                    return JsonResponse({"error": "No comments found"}, status=404)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        return JsonResponse({"error": "Invalid request method"}, status=400)
        
    @csrf_exempt
    @staticmethod
    def comment(request, post_id: int, user_id: int) -> JsonResponse:
        if request.method == "POST":
            user = User.objects.get(user_id=user_id)
            post = Post.objects.get(id=post_id)
            content = request.POST.get("content") 
            comment = Comment(user=user, post=post, content=content)
            comment.save()
            return JsonResponse({"status": "success"}, status=200)
        
    @csrf_exempt
    @staticmethod
    def edit_comment(request, comment_id: int) -> JsonResponse:
        if request.method == "POST":
            comment = Comment.objects.get(id=comment_id)
            content = request.POST.get("content")
            if content:
                comment.content = content
                comment.save()
                return JsonResponse({"status": "success"}, status=200)
            else:
                return JsonResponse({"error": "Content is missing"}, status=400)
    
    @csrf_exempt
    @staticmethod
    def delete_comment(request, comment_id: int) -> JsonResponse:
        if request.method == "DELETE":
            comment = Comment.objects.get(id=comment_id)
            comment.delete()
            return JsonResponse({"status": "Comment delete success..."}, status=200)