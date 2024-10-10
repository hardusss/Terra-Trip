import json

from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User


class CRUD:
    @csrf_exempt
    @staticmethod
    def create(request) -> JsonResponse:
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                username = data.get('username')
                user_email = data.get('user_email')
                password = data.get('password')
                from_country = data.get('from_country')
                country = data.get('country')

                if not username:
                    return JsonResponse({'error': 'Username is required'}, status=400)
                if not user_email:
                    return JsonResponse({'error': 'User email is required'}, status=400)
                if not password:
                    return JsonResponse({'error': 'Password is required'}, status=400)
                if not from_country:
                    return JsonResponse({'error': 'From country is required'}, status=400)
                if not country:
                    return JsonResponse({'error': 'Country is required'}, status=400)

                user = User(username=username, password=make_password(password), email=user_email,
                                 from_country=from_country, country=country)
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
                    'user_email': user.email,
                    'from_country': user.from_country,
                    'country': user.country
                }, status=200)
            except User.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'error': 'Invalid HTTP method. Only GET allowed.'}, status=405)

    @csrf_exempt
    @staticmethod
    def update(request, user_id) -> JsonResponse:
        if request.method == 'PUT':
            try:
                data = json.loads(request.body)
                user = User.objects.get(user_id=user_id)

                user.username = data.get('username')
                user.email = data.get('user_email')
                user.from_country = data.get('from_country')
                user.country = data.get('country')
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
