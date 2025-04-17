from fastapi import APIRouter, Depends
from api.v1 import user, auth
from core.dependencies import authentication_required

#
# TODO async postgres interactions
#
router = APIRouter(prefix="/api/v1")
router.include_router(user.router, dependencies=[Depends(authentication_required)], tags=["User management"])
router.include_router(auth.router, tags=["Authentication"])
