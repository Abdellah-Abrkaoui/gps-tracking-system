from typing import Any, Dict, Optional

from fastapi import HTTPException, status


class ForbiddenError(HTTPException):
    def __init__(self, detail: str = "Forbidden") -> None:
        super().__init__(status.HTTP_403_FORBIDDEN, detail)


class UnauthorizedError(HTTPException):
    def __init__(
        self, detail: str = "Forbidden", headers: Optional[Dict[str, Any]] = None
    ) -> None:
        super().__init__(status.HTTP_401_UNAUTHORIZED, detail, headers)


class NotFoundError(HTTPException):
    def __init__(self, detail: str = "Not found") -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, detail)
