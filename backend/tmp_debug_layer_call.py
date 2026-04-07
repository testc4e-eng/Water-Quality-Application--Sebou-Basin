from app.routers.layers import get_layer
from app.db.session import SessionLocal
from fastapi import HTTPException

db = SessionLocal()
try:
    for key in ['bassin_sebou','reseau_hydro_abhs']:
        print('\nKEY', key)
        try:
            data = get_layer(layer_key=key, ids=None, bbox=None, max_features=5, db=db)
            print('OK', type(data), str(data)[:200])
        except HTTPException as he:
            print('HTTPException', he.status_code, he.detail)
        except Exception as e:
            print('Exception', repr(e))
finally:
    db.close()
