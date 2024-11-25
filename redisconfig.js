const redis = require("redis");

const client = redis.createClient({
    url: "redis://redis:6379", 
    legacyMode: true,
});

client.on("connect", () => {
    console.log("Redis Database connected\n");
});

client.on("error", (err) => {
    console.error("Redis error:", err.message);
});

client.on("reconnecting", () => {
    console.log("Redis client reconnecting");
});

client.on("end", () => {
    console.log("Redis client disconnected");
});

client.connect().catch((err) => console.error("Error connecting to Redis:", err));

module.exports.set = async (key, value) => {
    try {
        await client.set(key, value);
        return "done";
    } catch (err) {
        console.error("Error setting key in Redis:", err.message);
    }
};

module.exports.get = async (key) => {
    try {
        return await client.get(key);
    } catch (err) {
        console.error("Error getting key from Redis:", err.message);
    }
};

module.exports.close = async () => {
    try {
        await client.quit();
    } catch (err) {
        console.error("Error closing Redis client:", err.message);
    }
};
