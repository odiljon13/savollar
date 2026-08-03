from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import ADMIN_USERNAME, ADMIN_PASSWORD, API_PREFIX
from app.crud import create_question, create_user, get_all_users, get_questions, get_question_by_id, update_question, delete_question, get_user_by_username
from app.database import Base, engine, get_db
from app.models import Question
from app.schemas import AdminLoginRequest, QuestionCreateRequest, QuestionResponse, QuestionUpdateRequest, UserLoginRequest, UserRegisterRequest, UserResponse

Base.metadata.create_all(bind=engine)

app = FastAPI(title='Logic Quest API', version='1.0.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/')
def root():
    return {'message': 'Logic Quest backend is running'}


@app.post(f'{API_PREFIX}/register', response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_username(db, payload.username)
    if existing:
        raise HTTPException(status_code=400, detail='Username already exists')

    user = create_user(db, payload)
    return user


@app.post(f'{API_PREFIX}/login', response_model=UserResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_username(db, payload.username)
    if not user or user.password != payload.password:
        raise HTTPException(status_code=401, detail='Invalid username or password')

    return user


@app.post(f'{API_PREFIX}/admin/login')
def admin_login(payload: AdminLoginRequest):
    if payload.username == ADMIN_USERNAME and payload.password == ADMIN_PASSWORD:
        return {'success': True, 'message': 'Admin authenticated'}

    raise HTTPException(status_code=401, detail='Invalid username or password')


@app.get(f'{API_PREFIX}/users', response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return get_all_users(db)


@app.post(f'{API_PREFIX}/questions', response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_new_question(payload: QuestionCreateRequest, db: Session = Depends(get_db)):
    return create_question(db, payload)


@app.get(f'{API_PREFIX}/questions', response_model=list[QuestionResponse])
def list_questions(db: Session = Depends(get_db)):
    return get_questions(db)


@app.get(f'{API_PREFIX}/questions/{{question_id}}', response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail='Question not found')
    return question


@app.put(f'{API_PREFIX}/questions/{{question_id}}', response_model=QuestionResponse)
def update_existing_question(question_id: int, payload: QuestionUpdateRequest, db: Session = Depends(get_db)):
    question = get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail='Question not found')

    return update_question(db, question, payload)


@app.delete(f'{API_PREFIX}/questions/{{question_id}}')
def delete_existing_question(question_id: int, db: Session = Depends(get_db)):
    question = get_question_by_id(db, question_id)
    if not question:
        raise HTTPException(status_code=404, detail='Question not found')

    delete_question(db, question)
    return {'message': 'Question deleted'}
