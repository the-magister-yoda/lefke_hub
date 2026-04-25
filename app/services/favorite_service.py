from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.models import Favorite, Ad
from app.errors import AdsNotFound, DbError


async def service_get_favorites(current_user, db):
    query = (
        select(Favorite)
        .options(joinedload(Favorite.ad).selectinload(Ad.category)
        )
        .where(
            Favorite.user_id == current_user.id
        )
    )

    result = await db.execute(query)
    favs = result.scalars().all()

    return favs


async def service_toggle_favorite(ad_id, user, db):
    query = select(Ad).where(Ad.id == ad_id)

    result = await db.execute(query)
    ad = result.scalar()

    if not ad:
        raise AdsNotFound()

    query_favorite = (
        select(Favorite)
        .where(
            Favorite.ad_id == ad_id,
            Favorite.user_id == user.id
        )
    )

    result = await db.execute(query_favorite)
    db_favorite = result.scalars().first()

    if db_favorite:
        await db.delete(db_favorite)
        status = False
    
    else:
        fav = Favorite(user_id=user.id, ad_id=ad_id)
        db.add(fav)
        status = True
    
    try:
        await db.commit()

    except Exception:
        await db.rollback()
        raise DbError()

    return {"is_favorite": status}



        

    
