from django.urls import path
from .views import (
    CreateQuizView,
    QuizHistoryView,
    QuizDetailView,
    SubmitAttemptView,
    AttemptHistoryView,
    AttemptResultView
)

urlpatterns = [
    path('generate', CreateQuizView.as_view(), name='quiz_create'),
    path('history', QuizHistoryView.as_view(), name='quiz_history'),
    path('<int:pk>', QuizDetailView.as_view(), name='quiz_detail'),
    path('<int:pk>/submit', SubmitAttemptView.as_view(), name='quiz_submit'),
    path('debug-env', DebugEnvView.as_view(), name='debug_env'),
]
