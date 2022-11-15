const express = require('express');
const Kafka = require('node-rdkafka');
const app = express();
fs = require('fs')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
var producer = new Kafka.Producer({
    'metadata.broker.list': 'kafka:9092',
    'dr_cb': true
});
producer.connect();
producer.setPollInterval(100);


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

app.get('/api/tracking/ping', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/tracking/save-item-status', async (req, res) => {
    const orderId = req.body.orderId;
    const status = req.body.status;

    let result;
    try {
        const snapshot = await db.collection('orders').doc(orderId).set({
            status
        }, {merge: true});
        result = {"result": "Success"};

        const d = await db.collection('orders').doc(orderId).get();

        try {
            let data = d.data();
            data["orderId"] = data.id;

            producer.produce(
                // Topic to send the message to
                'test',
                // optionally we can manually specify a partition for the message
                // this defaults to -1 - which will use librdkafka's default partitioner (consistent random for keyed messages, random for unkeyed messages)
                null,
                // Message to send. Must be a buffer
                Buffer.from(JSON.stringify(data)),
                // for keyed messages, we also specify the key - note that this field is optional
                'Stormwind',
                // you can send a timestamp here. If your broker version supports it,
                // it will get added. Otherwise, we default to 0
                Date.now(),
                // you can send an opaque token here, which gets passed along
                // to your delivery reports
            );

        } catch (err) {
            console.error('A problem occurred when sending our message');
            console.error(err);
            res.send("Error" + err);
        }

    } catch (e) {
        result = {"result": "Database is offline. Will retry later"};
    }

    res.send(result);
});

app.get('/api/tracking/get-order-status/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    const result = [];
    const snapshot = await db.collection('orders').doc(orderId).get();
    const d = snapshot.data();
    d["id"] = d.id;
    result.push(d);

    console.log(snapshot);
    res.send({"messages": result});
})

producer.on('event.error', function (err) {
    console.error('Error from producer');
    console.error(err);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


// curl -X POST -H "Content-Type: application/json" -d '{"status": "orderCreated", "orderId": "Gn23nGnwe3wC"}' localhost/api/tracking/save-item-status
// curl -X GET localhost/api/tracking/get-order-status/Gn23nGnwe3wC


