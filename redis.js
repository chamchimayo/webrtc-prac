const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const { createClient } = require("redis");
let redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
