from typing import List, Optional

from sqlalchemy.orm import Session

from app.models import Question, User
from app.schemas import QuestionCreateRequest, QuestionUpdateRequest, UserRegisterRequest


def create_user(db: Session, payload: UserRegisterRequest) -> User:
    user = User(
        username=payload.username,
        first_name=payload.first_name,
        last_name=payload.last_name,
        district=payload.district,
        admin_status=payload.admin_status,
        password=payload.password,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()


def get_all_users(db: Session) -> List[User]:
    return db.query(User).order_by(User.id.desc()).all()


def create_question(db: Session, payload: QuestionCreateRequest) -> Question:
    question = Question(
        category=payload.category,
        question_text=payload.question_text,
        correct_answer=payload.correct_answer,
        options=payload.options,
        difficulty_level=payload.difficulty_level,
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


def get_questions(db: Session) -> List[Question]:
    return db.query(Question).filter(Question.is_active == True).order_by(Question.id.asc()).all()


def get_question_by_id(db: Session, question_id: int) -> Optional[Question]:
    return db.query(Question).filter(Question.id == question_id).first()


def update_question(db: Session, question: Question, payload: QuestionUpdateRequest) -> Question:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(question, field, value)

    db.commit()
    db.refresh(question)
    return question


def delete_question(db: Session, question: Question) -> None:
    question.is_active = False
    db.commit()
