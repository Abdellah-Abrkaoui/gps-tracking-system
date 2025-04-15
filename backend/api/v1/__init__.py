from fastapi import APIRouter
from api.v1 import user 

#
# TODO async postgres interactions
#
router = APIRouter(prefix="/v1")
router.include_router(user.router)

