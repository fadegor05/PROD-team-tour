from typing import Annotated

from fastapi import Query, HTTPException
from starlette.responses import JSONResponse
from app.core.data import DOCUMENTS
from app.api.router import api_router


@api_router.get('/documents')
async def get_documents_by_org_type_handler(org_type: Annotated[str, Query()]):
    try:
        docs = {"documents": DOCUMENTS[f'{org_type}']}
        return JSONResponse(status_code=200, content=docs)
    except KeyError:
        raise HTTPException(status_code=404, detail="org_type not found in dict")
