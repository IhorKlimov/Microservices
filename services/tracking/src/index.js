const express = require('express');
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


// curl -X POST -H "Content-Type: application/json" -d '{"status": "orderCreated", "orderId": "Gn23nGnwe3wC"}' localhost/api/tracking/save-item-status
// curl -X GET localhost/api/tracking/get-order-status/Gn23nGnwe3wC


