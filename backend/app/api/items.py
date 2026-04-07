from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import crud, schemas, database

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(database.get_db)):
    return crud.create_item(db=db, item=item)

@router.get("/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 10, db: Session = Depends(database.get_db)):
    return crud.get_items(db=db, skip=skip, limit=limit)
