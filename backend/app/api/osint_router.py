"""
OSINT Scraper Router
whoiam - Social Media Intelligence & Account Forensics Platform
Endpoint investigasi URL postingan/akun langsung dan penarikan tagar media sosial.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.core.osint_engine import osint_engine

router = APIRouter(prefix="/osint", tags=["OSINT Scraper"])

class InspectUrlRequest(BaseModel):
    url: str = Field(min_length=5, description="URL postingan atau profil (X, Threads, Instagram, FB)")

class SearchIngestRequest(BaseModel):
    query: str = Field(min_length=2, description="Kata kunci atau tagar yang ingin ditarik datanya")
    platform: Optional[str] = Field(default="all", description="x, threads, instagram, atau all")
    limit: Optional[int] = Field(default=10, ge=1, le=30)
    inject_stream: Optional[bool] = Field(default=True, description="Apakah postingan langsung disuntikkan ke War Room")

@router.get("/status")
def get_osint_status():
    return {
        "status": "operational",
        "engine": "whoiam OSINT Scraper (Playwright & oEmbed Engine)",
        "supported_platforms": ["X (Twitter)", "Threads", "Instagram", "Facebook", "Web Articles"],
        "apify_configured": bool(osint_engine.apify_token)
    }

@router.post("/inspect-url")
async def inspect_url_endpoint(req: InspectUrlRequest):
    """
    Menganalisis link postingan atau akun profil dari media sosial secara langsung.
    """
    try:
        data = await osint_engine.inspect_url(req.url)
        return {
            "status": "success",
            "data": data
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membedah URL: {str(e)}")

@router.post("/search-ingest")
async def search_ingest_endpoint(req: SearchIngestRequest):
    """
    Menarik postingan terkini berdasarkan tagar/kata kunci dan menyuntikkannya ke War Room.
    """
    try:
        posts = await osint_engine.search_and_ingest(
            query=req.query,
            platform=req.platform or "all",
            limit=req.limit or 10,
            inject_stream=req.inject_stream
        )
        return {
            "status": "success",
            "query": req.query,
            "platform": req.platform,
            "count": len(posts),
            "data": posts
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal menarik data OSINT: {str(e)}")

class CompareAccountsRequest(BaseModel):
    url_a: str = Field(min_length=5, description="URL akun atau postingan A")
    url_b: str = Field(min_length=5, description="URL akun atau postingan B")

@router.post("/compare-accounts")
async def compare_accounts_endpoint(req: CompareAccountsRequest):
    """
    Membandingkan dua tautan akun/postingan secara berdampingan untuk mengukur sinkronisasi operator.
    """
    try:
        data = await osint_engine.compare_accounts(req.url_a, req.url_b)
        return {
            "status": "success",
            "data": data
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal membandingkan akun: {str(e)}")
