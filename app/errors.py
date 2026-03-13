# Users errors
class UserNotFound(Exception):
    pass


class UsernameAlreadyExists(Exception):
    pass


class EmailAlreadyExists(Exception):
    pass


class PhoneNumAlreadyExists(Exception):
    pass


class WrongPassword(Exception):
    pass


class AlreadyDeleted(Exception):
    pass


class UserActive(Exception):
    pass


class NotRights(Exception):
    pass


# Common Errors
class DbError(Exception):
    pass


class EmptyRequest(Exception):
    pass


# Ads Errors
class AdsNotFound(Exception):
    pass


# Categories Errors
class CategoryNotFound(Exception):
    pass

