from app.models import User
from app.errors import UsernameAlreadyExists, EmailAlreadyExists, PhoneNumAlreadyExists


def service_create_user(user, db):
    existing_user = db.query(User).filter(
        (User.username == user.username) |
        (User.email == user.email) |
        (User.phone_number == user.phone_number)
    ).first()

    if existing_user is not None:
        if existing_user.username == user.username:
            raise UsernameAlreadyExists()

        elif existing_user.email == user.email:
            raise EmailAlreadyExists()
        elif existing_user.phone_number == user.phone_number:
            raise PhoneNumAlreadyExists()

    hashed_password = 'grg'

    db_user = User(username=user.username, email=user.email, phone_number=user.phone_number, hashed_password=hashed_password)




