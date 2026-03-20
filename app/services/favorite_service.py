from sqlalchemy.orm import joinedload

from app.models import Favorite, Ad
from app.errors import AdsNotFound, DbError

def service_get_favorites(current_user, db):
    favs = db.query(Favorite).options(joinedload(Favorite.ad)).filter(
        Favorite.user_id == current_user.id
    ).all()

    return favs


def service_toggle_favorite(ad_id, user, db):
    ad = db.query(Ad).filter(Ad.id == ad_id).first()

    if not ad:
        raise AdsNotFound()

    db_favorite = db.query(Favorite).filter(
        Favorite.ad_id == ad_id,
        Favorite.user_id == user.id
    ).first()

    if db_favorite:
        db.delete(db_favorite)
        status = False
    
    else:
        fav = Favorite(user_id=user.id, ad_id=ad_id)
        db.add(fav)
        status = True
    
    try:
        db.commit()

    except Exception:
        db.rollback()
        raise DbError()

    return {"is_favorite": status}



        

    
