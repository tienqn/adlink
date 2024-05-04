const Redis = require("ioredis");
const { redis } = require("../../configs/cache");

module.exports = new Redis({
  host: redis.host,
  port: redis.port,
  password: redis.password,
  db: redis.db,
  readOnly: true,
});
