"""
Test the enhanced Python AST extractor.
"""

import pytest
from app.extractors.python_extractor import PythonExtractor
from app.schemas.uas import EndpointNode, DatabaseModelNode, CacheNode, ExternalAPINode


def test_fastapi_endpoint_extraction():
    """Test that FastAPI endpoints are correctly extracted"""
    code = """
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int, q: str = Query(...)):
    return {"id": user_id, "query": q}
"""
    
    extractor = PythonExtractor()
    result = extractor.extract("test.py", code)
    
    # Should find 1 endpoint
    endpoints = [n for n in result.nodes if isinstance(n, EndpointNode)]
    assert len(endpoints) == 1
    
    endpoint = endpoints[0]
    assert endpoint.method == "GET"
    assert endpoint.path == "/users/{user_id}"
    assert endpoint.name == "get_user"
    assert len(endpoint.parameters) >= 1
    assert endpoint.confidence == "HIGH"


def test_sqlalchemy_model_extraction():
    """Test that SQLAlchemy models are correctly extracted"""
    code = """
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    email = Column(String)
    name = Column(String)
"""
    
    extractor = PythonExtractor()
    result = extractor.extract("models.py", code)
    
    # Should find 1 database model
    models = [n for n in result.nodes if isinstance(n, DatabaseModelNode)]
    assert len(models) == 1
    
    model = models[0]
    assert model.name == "User"
    assert model.table_name == "users"
    assert len(model.columns) >= 1
    assert model.confidence == "HIGH"


def test_redis_detection():
    """Test that Redis usage is detected"""
    code = """
import redis

redis_client = redis.Redis(host="localhost", port=6379)

def cache_data():
    redis_client.setex("key", 3600, "value")
"""
    
    extractor = PythonExtractor()
    result = extractor.extract("cache.py", code)
    
    # Should find Redis cache node
    caches = [n for n in result.nodes if isinstance(n, CacheNode)]
    assert len(caches) >= 1
    
    cache = caches[0]
    assert cache.technology == "Redis"
    assert cache.host == "localhost"
    assert cache.port == 6379


def test_external_api_call_detection():
    """Test that external API calls are detected"""
    code = """
import httpx

async def call_stripe():
    response = await httpx.get("https://api.stripe.com/v1/charges")
    return response.json()
"""
    
    extractor = PythonExtractor()
    result = extractor.extract("api_client.py", code)
    
    # Should find external API node
    external_apis = [n for n in result.nodes if isinstance(n, ExternalAPINode)]
    assert len(external_apis) >= 1
    
    api = external_apis[0]
    assert api.provider == "Stripe"
    assert "stripe.com" in api.base_url


def test_empty_file():
    """Test that empty files don't crash"""
    code = ""
    
    extractor = PythonExtractor()
    result = extractor.extract("empty.py", code)
    
    assert result.nodes == []
    assert result.edges == []


def test_syntax_error_handling():
    """Test that files with syntax errors are handled gracefully"""
    code = """
    def broken function(
        this is invalid python
    """
    
    extractor = PythonExtractor()
    result = extractor.extract("broken.py", code)
    
    assert result.confidence == "LOW"
    assert result.nodes == []


if __name__ == "__main__":
    # Run tests manually
    test_fastapi_endpoint_extraction()
    test_sqlalchemy_model_extraction()
    test_redis_detection()
    test_external_api_call_detection()
    test_empty_file()
    test_syntax_error_handling()
    
    print("✅ All tests passed!")
