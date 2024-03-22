const mongoose = require('mongoose');
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')

const client = redis.createClient(keys.redisUrl)
client.hget = util.promisify(client.hget)   // để tránh dùng callback trong hàm get để lấy dữ liệu từ cache, ta dùng util.promisity để client.get trả về 1 promise
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    // console.log("this.hashKey", this.hashKey)
    return this
}


mongoose.Query.prototype.exec = async function () {
    if (!this.useCache) {
        return exec.apply(this, arguments)
    }


    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    const cachedBlogs = await client.hget(this.hashKey, key)

    // if yes, then respond to the request right away and return
    if (cachedBlogs) {
        const doc = JSON.parse(cachedBlogs)
        console.log('SERVING FROM CACHE')
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(JSON.parse(cachedBlogs))
    }

    console.log('IM ABOUT TO RUN A QUERY')
    const result = await exec.apply(this, arguments)
    client.hset(this.hashKey, key, JSON.stringify(result));
    return result
}

module.exports = {
    clearHash(hashKey) {
        console.log('clear something: ', JSON.stringify(hashKey))
        client.del(JSON.stringify(hashKey))
    }
}