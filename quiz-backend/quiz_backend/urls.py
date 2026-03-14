from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("<h1>Lumina AI Backend is Live 🚀</h1><p>The API is running and ready for requests.</p>")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/quiz/', include('quizzes.urls')),
    path('api/attempt/', include('quizzes.urls_attempts')),
]
