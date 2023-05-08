import redish from '@srfnstack/redish';
import redis from "redis";

export const client = redis.createClient({
    url: 'redis://localhost:26379'
})
client.on('error', console.error)
const db = redish.createDb(client)
const stuff = db.collection('stuff')

async function run() {
    await client.connect()

    await client.del("redis_1234")

    await stuff.deleteById("redish_1234")
}

run().then(()=>{
    client.disconnect()
    console.log("Key deleted!!")
})