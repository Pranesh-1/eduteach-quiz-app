from rest_framework import serializers
from .models import Quiz, Question, Attempt, UserAnswer

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d']

class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'topic', 'difficulty', 'num_questions', 'time_limit_minutes', 'created_at', 'questions']
        read_only_fields = ['user', 'created_at']

class UserAnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.CharField(source='question.question_text', read_only=True)
    correct_answer = serializers.CharField(source='question.correct_answer', read_only=True)
    explanation = serializers.CharField(source='question.explanation', read_only=True)
    
    class Meta:
        model = UserAnswer
        fields = ['question', 'question_text', 'selected_option', 'correct_answer', 'is_correct', 'explanation', 'question_order']
        read_only_fields = ['attempt', 'is_correct']

class AttemptSerializer(serializers.ModelSerializer):
    answers = UserAnswerSerializer(many=True, read_only=True)
    quiz_topic = serializers.CharField(source='quiz.topic', read_only=True)

    class Meta:
        model = Attempt
        fields = ['id', 'quiz', 'quiz_topic', 'score', 'total', 'completed_at', 'answers']
        read_only_fields = ['user', 'score', 'total', 'completed_at']
