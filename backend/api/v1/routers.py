from fastapi import APIRouter

from api.v1.routes.auth import router as user_router
from api.v1.routes.device import router as device_router
from api.v1.routes.user import router as auth_router

routers = APIRouter(prefix="/api/v1")
router_list = [auth_router, user_router, device_router]

for router in router_list:
    routers.include_router(router)
