from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/example")
async def user_example():
    return JSONResponse({"message": "User endpoint (예시)"})
