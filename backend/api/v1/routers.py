from fastapi import APIRouter

from api.v1.routes.auth import router as user_router
from api.v1.routes.user import router as auth_router

routers = APIRouter(prefix="/api/v1")
router_list = [auth_router, user_router]

for router in router_list:
    router.tags = routers.tags.append("v1")
    routers.include_router(router)
