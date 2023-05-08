import redish from '@srfnstack/redish';
import redis from "redis";

export const client = redis.createClient({
    url: 'redis://localhost:26379'
})
client.on('error', console.error)
const db = redish.createDb(client)
const stuff = db.collection('stuff')


function printData(msg, data, lastStart) {
    msg = msg+" at "+Date.now()
    if(lastStart) {
        msg += ", took "+(Date.now() - lastStart)+"ms"
    }
    console.log(msg+"\n---\n", JSON.stringify(data, null, " "), '\n---\n')
}

async function findOneById(id) {
    return JSON.parse(await client.get(id))
}

async function save(id, existing){
    await client.set(id, JSON.stringify(existing))
    return existing
}

async function run(){
    await client.connect()
    const id = "redis_1234"

    let start = Date.now()

    let data = await findOneById(id)

    printData("Initially Loaded", data, start)

    if (data) {
        data.things.push({name: "thing" + (data.things.length + 1)})
    } else {
        data = {
            id,
            things: [
                {name: 'thing1'},
                {name: 'thing2'}
            ]
        }
    }

    printData("Data Before Save", data)

    start = Date.now()
    const saved = await save(id, data)

    printData("Saved", saved, start)

    start = Date.now()
    const loaded = await findOneById(saved.id)

    printData("Loaded", loaded, start)
}

run().then(()=>{
    client.disconnect()
    console.log("Example Completed!")
})