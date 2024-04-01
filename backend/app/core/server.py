from fastapi import FastAPI, APIRouter
from app.core.routers import routers
from typing import Tuple
from fastapi.middleware.cors import CORSMiddleware

ORIGINS = [
    '*'
]


class Server:

    app: FastAPI

    def __init__(self, app: FastAPI) -> None:
        self.app = app
        self.register_routers(routers)
        self.add_cors(ORIGINS)

    def get_app(self) -> FastAPI:
        return self.app

    def add_cors(self, origins: Tuple[str]):
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=['*'],
            allow_headers=['*']
        )

    def register_routers(self, routers: Tuple[APIRouter]):
        for router in routers:
            self.app.include_router(router = router)