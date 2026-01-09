from neo4j import AsyncGraphDatabase

class Neo4jClient:
    def __init__(self):
        self._driver = None

    def connect(self, uri: str, auth: tuple):
        self._driver = AsyncGraphDatabase.driver(uri, auth=auth)

    async def close(self):
        if self._driver:
            await self._driver.close()

    async def execute_query(self, query: str, parameters: dict = None, db: str = None):
        """
        Execute a cypher query and return the result.
        """
        async with self._driver.session(database=db) as session:
            result = await session.run(query, parameters)
            return [record async for record in result]

    def get_driver(self):
        return self._driver

neo4j_client = Neo4jClient()
