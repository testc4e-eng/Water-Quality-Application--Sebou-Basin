from passlib.context import CryptContext

# Use pbkdf2_sha256 to avoid bcrypt backend issues on Windows.
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return pwd_context.verify(password, hashed_password)


def validate_password_strength(password: str) -> list[str]:
    issues: list[str] = []
    if len(password) < 8:
        issues.append("Longueur minimale 8 caracteres")
    return issues
