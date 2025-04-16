from fastapi import APIRouter
from api.v1 import user, auth

#
# TODO async postgres interactions
#
router = APIRouter(prefix="/v1")
router.include_router(user.router)
router.include_router(auth.router)


