# backend/app/api/v1/items.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.models.item import Item
from app.models.user import User
from app.schemas.item import ItemCreate, ItemOut, ItemUpdate

router = APIRouter(prefix="/items", tags=["Items"])

@router.get("/", response_model=List[ItemOut])
def list_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Item).filter(Item.owner_id == current_user.id).order_by(Item.id.desc()).all()

@router.post("/", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
def create_item(item_in: ItemCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = Item(title=item_in.title, description=item_in.description, owner_id=current_user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/{item_id}", response_model=ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=ItemOut)
def update_item(item_id: int, item_in: ItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item_in.title is not None:
        item.title = item_in.title
    if item_in.description is not None:
        item.description = item_in.description
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return
