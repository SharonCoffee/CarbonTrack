const neo4j = require("neo4j-driver");

// Setup Neo4j connection
const driver = neo4j.driver("neo4j+s://a4252f23.databases.neo4j.io", neo4j.auth.basic("neo4j", "XwLUtPz3EDjAkDIRPZru48txQBKCbDf8sBPnS6j6jqk"));

// eslint-disable-next-line require-jsdoc
async function getSomeData() {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 25");
    return result.records;
  } finally {
    await session.close();
  }
}

// Export the function to use in index.js or other parts of your project
module.exports = { getSomeData };

