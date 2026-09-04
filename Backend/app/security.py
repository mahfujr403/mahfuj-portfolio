import os
import secrets

from fastapi import Header, HTTPException, status

# Set ADMIN_TOKEN as an environment variable on Render (or wherever the API
# is hosted). Generate one with: python -c "import secrets; print(secrets.token_urlsafe(32))"
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")


def require_admin(x_admin_token: str = Header(default=None)) -> None:
    """Dependency that protects mutating (POST/PUT/DELETE) routes.

    Read-only GET routes stay public since this is a public portfolio site.
    """
    if not ADMIN_TOKEN:
        # Fail closed: if no token is configured, refuse all mutations
        # instead of silently allowing them.
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin token not configured on the server.",
        )
    if not x_admin_token or not secrets.compare_digest(x_admin_token, ADMIN_TOKEN):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )
