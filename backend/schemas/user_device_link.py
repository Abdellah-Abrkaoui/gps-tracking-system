from pydantic import BaseModel


class UserDeviceLink(BaseModel):
    id: int
    user_id: int
    device_id: int
