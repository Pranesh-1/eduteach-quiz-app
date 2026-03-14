from django.urls import path
from quizzes.views import AttemptHistoryView, AttemptResultView

urlpatterns = [
    path('<int:pk>', AttemptResultView.as_view(), name='attempt_result'),
    path('history/', AttemptHistoryView.as_view(), name='attempt_history'),
]
