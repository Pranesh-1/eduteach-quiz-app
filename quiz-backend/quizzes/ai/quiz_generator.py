import os
import json
import re
import logging
from groq import Groq

logger = logging.getLogger(__name__)

def get_groq_client():
    # Explicitly clear proxy env vars that often crash httpx in restricted envs
    for env_var in ["HTTP_PROXY", "HTTPS_PROXY", "all_proxy", "ALL_PROXY"]:
        os.environ.pop(env_var, None)
        
    key = os.environ.get("GROQ_API_KEY")
    if not key:
        logger.error("GROQ_API_KEY is missing from environment variables!")
    return Groq(api_key=key, timeout=60.0, max_retries=2)

def validate_quiz_data(data):
    if not isinstance(data, list):
        return False, "AI response is not a list."
    
    required_keys = {"question", "options", "answer", "explanation"}
    valid_answers = {"A", "B", "C", "D"}
    
    for idx, item in enumerate(data):
        if not all(key in item for key in required_keys):
            return False, f"Question {idx+1} is missing required keys."
        if not isinstance(item["options"], list) or len(item["options"]) != 4:
            return False, f"Question {idx+1} must have exactly 4 options."
        if item["answer"] not in valid_answers:
            return False, f"Question {idx+1} has an invalid answer letter: {item['answer']}"
    
    return True, None

def generate_quiz_questions(topic, difficulty, num_questions):
    client = get_groq_client()
    prompt = f"""
    Generate {num_questions} multiple choice questions about "{topic}".
    Difficulty: {difficulty}.

    STRICT RULES:
    1. "options" must be a list of exactly 4 answer strings (the actual answer text, NOT letters).
    2. "answer" MUST be ONLY a single uppercase letter: A, B, C, or D — nothing else.
    3. The letter in "answer" must correspond to the index of the correct option (A=first, B=second, C=third, D=fourth).
    4. Output ONLY the raw JSON array. No markdown, no backticks, no extra text.

    Return this exact format:
    [
     {{
       "question": "question text here",
       "options": ["First choice", "Second choice", "Third choice", "Fourth choice"],
       "answer": "A",
       "explanation": "Brief explanation of why this answer is correct."
     }}
    ]

    IMPORTANT: "answer" value MUST be exactly one of: A, B, C, D
    """
    
    try:
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        
        content = response.choices[0].message.content.strip()
        
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            content = match.group(0)
            
        if not content:
             raise ValueError("Empty response from AI")

        data = json.loads(content)
        
        # New Validation Step
        is_valid, error_msg = validate_quiz_data(data)
        if not is_valid:
            logger.error(f"AI Schema Validation Failed: {error_msg}")
            return {"success": False, "error": f"AI verification failed: {error_msg}"}

        return {"success": True, "data": data}
        
    except json.JSONDecodeError as e:
        logger.error(f"JSON Decode Error. Raw content: {content}")
        return {"success": False, "error": "Invalid response format from AI. Please try again."}
    except Exception as e:
        logger.error(f"AI Service Error: {str(e)}")
        return {"success": False, "error": "AI service unavailable or timed out."}
