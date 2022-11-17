const express = require('express');
const Kafka = require('node-rdkafka');
const app = express();
fs = require('fs')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({extended: false})

const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');
const {credential} = require("firebase-admin");
const serviceAccount = require('../serviceAccountKey.json');
app.use(express.urlencoded());
app.use(express.json());

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const port = 8080;
console.log("here")
var consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'kafka:9092',
}, {});
console.log("here 1")

consumer
    .on('event.error', function (err) {
        console.log("error " + err);
    })
    .on('ready', function () {
        console.log("ready")
        consumer.subscribe(['test']);

        // Consume from the test topic. This is what determines
        // the mode we are running in. By not specifying a callback (or specifying
        // only a callback) we get messages as soon as they are available.
        consumer.consume();
    })
    .on('data', function (data) {
        // Output the actual message contents
        console.log(data.value.toString());
        console.log(JSON.parse(data.value.toString()));
    });
console.log("here 3")

app.get('/api/goods/ping', (req, res) => {
    consumer.connect();
    res.send('Hello World!');
});

app.post('/api/goods/save-item', async (req, res) => {
    const item = req.body.item;

    let result = await saveItem(item);

    res.send(result);
});

async function saveItem(item) {
    let result;
    try {
        const snapshot = await db.collection('items').add({
            item
        });
        result = {"result": "Success"};
    } catch (e) {
        result = {"result": "Database is offline. Will retry later"};
    }
    return result;
}

app.get('/api/goods/get-items', async (req, res) => {
    // const userId = req.params.userId;

    const result = [];
    const snapshot = await db.collection('items').get();
    snapshot.forEach(data => {
        const d = data.data()
        d["id"] = data.id;
        result.push(d);
    });
    console.log(snapshot);
    res.send({"messages": result});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


// curl -X POST -H "Content-Type: application/json" -d "{  \"item\": {    \"category\": \"Category 1\",    \"title\": \"Item 1\",    \"price\": 150,    \"imageUrl\": \"https://www.lindt.ca/media/catalog/product/6/6/66209996d33cf86c5e4e04c8135a9560e8a1869d95203cdf55567a2167549186.jpeg?quality=80&fit=bounds&height=700&width=700&canvas=700:700\"  }}" localhost/api/goods/save-item
// curl -X GET localhost/api/goods/get-items


