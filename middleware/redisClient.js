const redis = require('redis');
const client = redis.createClient(6379,'redis');
(async () => {
    client.on("error", (err) => {
        console.log("Redis Client Error", err);
    });
    client.on("ready", () => console.log("Redis is ready"));
    await client.connect();
    await client.ping();
})();

function addNewData(key, value) {
    client.set(key, value).then(r =>{
        console.log("success save data, key: {}",key)
    });
}

function flushAll(){
    client.flushAll()
        .then(r => console.log("Success flush data: ",r));
}
module.exports = {
    client,
    flushAll,
    addNewData
};
