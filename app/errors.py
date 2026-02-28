class UserNotFound(Exception):
    pass


class UsernameAlreadyExists(Exception):
    pass


class EmailAlreadyExists(Exception):
    pass


class PhoneNumAlreadyExists(Exception):
    pass


class DbError(Exception):
    pass


class WrongPassword(Exception):
    pass


class AlreadyDeleted(Exception):
    pass


class UserActive(Exception):
    pass