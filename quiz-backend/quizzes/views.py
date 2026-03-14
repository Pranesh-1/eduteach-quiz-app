from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Quiz, Question, Attempt, UserAnswer
from .serializers import QuizSerializer, AttemptSerializer
from .ai.quiz_generator import generate_quiz_questions

class CreateQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty')
        num_questions = int(request.data.get('num_questions', 5))
        time_limit_raw = request.data.get('time_limit_minutes')
        time_limit = int(time_limit_raw) if time_limit_raw is not None else 0

        if not topic or not difficulty:
            return Response({"error": "Topic and difficulty are required"}, status=status.HTTP_400_BAD_REQUEST)

        ai_response = generate_quiz_questions(topic, difficulty, num_questions)
        
        if not ai_response.get("success"):
            return Response({"error": ai_response.get("error", "AI Service Error")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        raw_questions = ai_response["data"]

        quiz = Quiz.objects.create(
            user=request.user,
            topic=topic,
            difficulty=difficulty,
            num_questions=len(raw_questions),
            time_limit_minutes=time_limit
        )

        for idx, q_data in enumerate(raw_questions):
            opts = q_data.get('options', [])
            if len(opts) < 4:
                opts.extend([''] * (4 - len(opts)))

            raw_answer = str(q_data.get('answer', 'A')).strip()

            # Normalize: ensure answer is A/B/C/D
            # If AI returned a letter, use it directly; otherwise match text to option
            upper_answer = raw_answer.upper()
            if upper_answer in ['A', 'B', 'C', 'D']:
                correct_letter = upper_answer
            else:
                # AI returned full text — find which option matches
                letter_map = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
                correct_letter = 'A'  # fallback
                raw_lower = raw_answer.lower()
                for letter, idx in letter_map.items():
                    if idx < len(opts) and raw_lower in opts[idx].lower():
                        correct_letter = letter
                        break

            Question.objects.create(
                quiz=quiz,
                question_text=q_data.get('question', ''),
                option_a=opts[0][:255],
                option_b=opts[1][:255],
                option_c=opts[2][:255],
                option_d=opts[3][:255],
                correct_answer=correct_letter,
                explanation=q_data.get('explanation', '')
            )

        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QuizHistoryView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.filter(user=self.request.user).order_by('-created_at')

class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    queryset = Quiz.objects.all()

class SubmitAttemptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({"error": "Quiz not found"}, status=status.HTTP_404_NOT_FOUND)

        answers_data = request.data.get('answers', [])
        score = 0
        total = quiz.questions.count()

        # Index answers by question_id for quick lookup
        ans_lookup = {a.get('question_id'): a for a in answers_data}
        
        attempt = Attempt.objects.create(
            quiz=quiz,
            user=request.user,
            score=0,
            total=total
        )

        for idx, question in enumerate(quiz.questions.all().order_by('id')):
            submitted_ans = ans_lookup.get(question.id)
            selected_option = ''
            order = idx
            
            if submitted_ans:
                selected_option = str(submitted_ans.get('selected_option', '')).strip()[:1].upper()
                order = submitted_ans.get('order', idx)

            is_correct = (selected_option == question.correct_answer.upper())
            if is_correct:
                score += 1
            
            UserAnswer.objects.create(
                attempt=attempt,
                question=question,
                selected_option=selected_option,
                is_correct=is_correct,
                question_order=order
            )

        attempt.score = score
        attempt.save()

        serializer = AttemptSerializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class AttemptHistoryView(generics.ListAPIView):
    serializer_class = AttemptSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user).order_by('-completed_at')

class AttemptResultView(generics.RetrieveAPIView):
    serializer_class = AttemptSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user)
