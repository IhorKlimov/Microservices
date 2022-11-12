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

app.get('/api/service5/ping', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/service5/send-notification', async (req, res) => {
    const toUserId = req.body.toUserId;
    const message = req.body.message;

    let result = await saveNotification(toUserId, message);

    res.send(result);
});

async function saveNotification(userId, message) {
    let result;
    try {
        const snapshot = await db.collection('notifications').doc(userId).collection("messages").add({
            userId,
            message,
            timestamp: Timestamp.now()
        });
        result = {"result": "Success"};
    } catch (e) {
        result = {"result": "Database is offline. Will retry later"};
    }
    return result;
}

app.get('/api/service5/get-notifications/:userId', async (req, res) => {
    const userId = req.params.userId;

    const result = [];
    const snapshot = await db.collection('notifications').doc(userId).collection("messages").get();
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


// curl -X POST -H "Content-Type: application/json" -d '{"toUserId": "VGkotC32IMFVvdIpC3Yn", "message": "Test notification!"}' localhost/api/service5/send-notification
// curl -X GET localhost/api/service5/get-notifications/VGkotC32IMFVvdIpC3Yn


