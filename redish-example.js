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

async function run() {
    await client.connect()
    const id = "redish_1234"

    let start = Date.now()
    let data = await stuff.findOneById(id)

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
    const saved = await stuff.save(data)

    printData("Saved", saved, start)

    start = Date.now()
    const loaded = await stuff.findOneById(saved.id)

    printData("Loaded", loaded, start)
}

run().then(()=>{
    client.disconnect()
    console.log("Example Completed!")
})