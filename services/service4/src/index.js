const express = require('express');
const app = express();
fs = require('fs')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

var urlencodedParser = bodyParser.urlencoded({extended: false})

const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');
const {credential} = require("firebase-admin");
const failedMessages = [];
const serviceAccount = require('../serviceAccountKey.json');
app.use(express.urlencoded());
app.use(express.json());

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const port = 8080;

app.get('/api/service4/ping', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/service4/send-message', async (req, res) => {
    const userId = req.headers["userid"];

    const chatId = req.body.chatId;
    const message = req.body.message;

    let result = await sendMessage(chatId, userId, message);

    res.send(result);
});

async function sendMessage(chatId, userId, message) {
    let result;
    try {
        const snapshot = await db.collection('chats').doc(chatId).collection("messages").add({
            userId,
            message,
            timestamp: Timestamp.now()
        });
        result = {"result": "Success"};
    } catch (e) {
        result = {"result": "Database is offline. Will retry later"};
        failedMessages.push({
            userId,
            chatId,
            message,
        })
    }
    return result;
}

app.get('/api/service4/get-messages/:chatId', async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.headers["userid"];

    console.log(chatId)

    const result = [];
    const snapshot = await db.collection('chats').doc(chatId).collection("messages").get();
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


// curl -X POST -H "Content-Type: application/json" -H "UserId: VGkotC32IMFVvdIpC3Yn" -d '{"chatId": "EWEFGN@2n23mv", "message": "Hey there!"}' localhost/api/service4/send-message


