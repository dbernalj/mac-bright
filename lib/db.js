const { createClient } = require("@libsql/client");

let cliente;

function getDB() {
  if (!cliente) {
    cliente = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return cliente;
}

module.exports = { getDB };
