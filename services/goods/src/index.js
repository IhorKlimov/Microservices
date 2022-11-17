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

app.post('/api/goods/save-items', async (req, res) => {
    const items = req.body.items;

    for (const i of items) {
        await saveItem(i);
    }

    res.send("Saved");
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
        const d = data.data().item
        d["id"] = data.id;
        result.push(d);
    });
    res.send(result);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});


// curl -X POST -H "Content-Type: application/json" -d "{  \"item\": {    \"category\": \"Category 1\",    \"title\": \"Item 1\",    \"price\": 150,    \"imageUrl\": \"https://www.lindt.ca/media/catalog/product/6/6/66209996d33cf86c5e4e04c8135a9560e8a1869d95203cdf55567a2167549186.jpeg?quality=80&fit=bounds&height=700&width=700&canvas=700:700\"  }}" localhost/api/goods/save-item
// curl -X POST -H "Content-Type: application/json" -d "{\"items\":[{\"adult\":false,\"backdrop_path\":\"/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg\",\"genre_ids\":[28,12,878],\"id\":505642,\"original_language\":\"en\",\"original_title\":\"BlackPanther:WakandaForever\",\"overview\":\"QueenRamonda,Shuri,M’Baku,OkoyeandtheDoraMilajefighttoprotecttheirnationfrominterveningworldpowersinthewakeofKingT’Challa’sdeath.AstheWakandansstrivetoembracetheirnextchapter,theheroesmustbandtogetherwiththehelpofWarDogNakiaandEverettRossandforgeanewpathforthekingdomofWakanda.\",\"popularity\":3728.879,\"poster_path\":\"/sv1xJUazXeYqALzczSZ3O6nkH75.jpg\",\"release_date\":\"2022-11-09\",\"title\":\"BlackPanther:WakandaForever\",\"video\":false,\"vote_average\":7.5,\"vote_count\":667},{\"adult\":false,\"backdrop_path\":\"/bQXAqRx2Fgc46uCVWgoPz5L5Dtr.jpg\",\"genre_ids\":[28,14,878],\"id\":436270,\"original_language\":\"en\",\"original_title\":\"BlackAdam\",\"overview\":\"Nearly5,000yearsafterhewasbestowedwiththealmightypowersoftheEgyptiangods—andimprisonedjustasquickly—BlackAdamisfreedfromhisearthlytomb,readytounleashhisuniqueformofjusticeonthemodernworld.\",\"popularity\":4430.63,\"poster_path\":\"/3zXceNTtyj5FLjwQXuPvLYK5YYL.jpg\",\"release_date\":\"2022-10-19\",\"title\":\"BlackAdam\",\"video\":false,\"vote_average\":6.9,\"vote_count\":1114},{\"adult\":false,\"backdrop_path\":\"/yNib9QAiyaopUJbaayKQ2xK7mYf.jpg\",\"genre_ids\":[18,28,10752],\"id\":966220,\"original_language\":\"uk\",\"original_title\":\"Снайпер.Білийворон\",\"overview\":\"Mykolaisaneccentricpacifistwhowantstobeusefultohumanity.WhenthewarbeginsatDonbass,Mykola’snaiveworldiscollapsingasthemilitantskillhispregnantwifeandburnhishometotheground.Recovered,hemakesacardinaldecisionandgetsenlistedinasnipercompany.Havingmethiswife’skillers,heemotionallybreaksdownandarranges“sniperterror”fortheenemy.He’ssavedfromasenselessdeathbyhisinstructorwhohimselfgetsmortallywounded.Thedeathofafriendleavesa“scar”andMykolaisreadytosacrificehislife.\",\"popularity\":2665.449,\"poster_path\":\"/lZOODJzwuQo0etJJyBBZJOSdZcW.jpg\",\"release_date\":\"2022-05-03\",\"title\":\"Sniper:TheWhiteRaven\",\"video\":false,\"vote_average\":7.5,\"vote_count\":74},{\"adult\":false,\"backdrop_path\":\"/y5Z0WesTjvn59jP6yo459eUsbli.jpg\",\"genre_ids\":[27,53],\"id\":663712,\"original_language\":\"en\",\"original_title\":\"Terrifier2\",\"overview\":\"Afterbeingresurrectedbyasinisterentity,ArttheClownreturnstoMilesCountywherehemusthuntdownanddestroyateenagegirlandheryoungerbrotheronHalloweennight.Asthebodycountrises,thesiblingsfighttostayalivewhileuncoveringthetruenatureofArt'sevilintent.\",\"popularity\":2107.165,\"poster_path\":\"/b6IRp6Pl2Fsq37r9jFhGoLtaqHm.jpg\",\"release_date\":\"2022-10-06\",\"title\":\"Terrifier2\",\"video\":false,\"vote_average\":7,\"vote_count\":603},{\"adult\":false,\"backdrop_path\":\"/u9Io1hVnxb2b3T0z99aOK8sq0SN.jpg\",\"genre_ids\":[9648,12,80],\"id\":829280,\"original_language\":\"en\",\"original_title\":\"EnolaHolmes2\",\"overview\":\"Nowadetective-for-hirelikeherinfamousbrother,EnolaHolmestakesonherfirstofficialcasetofindamissinggirl,asthesparksofadangerousconspiracyigniteamysterythatrequiresthehelpoffriends—andSherlockhimself—tounravel.\",\"popularity\":1961.331,\"poster_path\":\"/tegBpjM5ODoYoM1NjaiHVLEA0QM.jpg\",\"release_date\":\"2022-11-04\",\"title\":\"EnolaHolmes2\",\"video\":false,\"vote_average\":7.7,\"vote_count\":890},{\"adult\":false,\"backdrop_path\":\"/olPXihyFeeNvnaD6IOBltgIV1FU.jpg\",\"genre_ids\":[27,9648,53],\"id\":882598,\"original_language\":\"en\",\"original_title\":\"Smile\",\"overview\":\"Afterwitnessingabizarre,traumaticincidentinvolvingapatient,Dr.RoseCotterstartsexperiencingfrighteningoccurrencesthatshecan'texplain.Asanoverwhelmingterrorbeginstakingoverherlife,Rosemustconfronthertroublingpastinordertosurviveandescapeherhorrifyingnewreality.\",\"popularity\":3419.675,\"poster_path\":\"/aPqcQwu4VGEewPhagWNncDbJ9Xp.jpg\",\"release_date\":\"2022-09-23\",\"title\":\"Smile\",\"video\":false,\"vote_average\":6.7,\"vote_count\":551},{\"adult\":false,\"backdrop_path\":\"/b2FxWOxe9K7ZZ1uaPOze2RJ1ajq.jpg\",\"genre_ids\":[27,28,35],\"id\":675054,\"original_language\":\"es\",\"original_title\":\"MexZombies\",\"overview\":\"Agroupofteenagersmustfaceazombieapocalypse,andhelpreestablishorder.\",\"popularity\":1570.461,\"poster_path\":\"/85zufUxhD97k2s5Bu2u101Qd8Sg.jpg\",\"release_date\":\"2022-10-26\",\"title\":\"MexZombies\",\"video\":false,\"vote_average\":7.2,\"vote_count\":77},{\"adult\":false,\"backdrop_path\":\"/mqsPyyeDCBAghXyjbw4TfEYwljw.jpg\",\"genre_ids\":[10752,18,28],\"id\":49046,\"original_language\":\"de\",\"original_title\":\"ImWestennichtsNeues\",\"overview\":\"PaulBaumerandhisfriendsAlbertandMuller,eggedonbyromanticdreamsofheroism,voluntarilyenlistintheGermanarmy.Fullofexcitementandpatrioticfervour,theboysenthusiasticallymarchintoawartheybelievein.ButonceontheWesternFront,theydiscoverthesoul-destroyinghorrorofWorldWarI.\",\"popularity\":1420.85,\"poster_path\":\"/hYqOjJ7Gh1fbqXrxlIao1g8ZehF.jpg\",\"release_date\":\"2022-10-07\",\"title\":\"AllQuietontheWesternFront\",\"video\":false,\"vote_average\":7.8,\"vote_count\":787},{\"adult\":false,\"backdrop_path\":\"/f9g3R9gq0bASip9RnK2H56dbb5j.jpg\",\"genre_ids\":[53],\"id\":979924,\"original_language\":\"en\",\"original_title\":\"OntheLine\",\"overview\":\"Aprovocativeandedgyradiohostmustplayadangerousgameofcatandmousewithamysteriouscallerwho'skidnappedhisfamilyandisthreateningtoblowupthewholestation.\",\"popularity\":1609.63,\"poster_path\":\"/jVmWI8PqoVTHCnrLYAcyrclzeY0.jpg\",\"release_date\":\"2022-10-31\",\"title\":\"OntheLine\",\"video\":false,\"vote_average\":6.6,\"vote_count\":109},{\"adult\":false,\"backdrop_path\":\"/pGx6O6IwqADOsgmqWzPysmWnOyr.jpg\",\"genre_ids\":[28,14],\"id\":732459,\"original_language\":\"en\",\"original_title\":\"Bladeofthe47Ronin\",\"overview\":\"Inthissequelto\\\"47Ronin,\\\"anewclassofwarriorsemergesamongtheSamuraiclanstokeepasought-afterswordfromfallingintothewronghands.\",\"popularity\":1083.84,\"poster_path\":\"/kjFDIlUCJkcpFxYKtE6OsGcAfQQ.jpg\",\"release_date\":\"2022-10-25\",\"title\":\"Bladeofthe47Ronin\",\"video\":false,\"vote_average\":6.8,\"vote_count\":74},{\"adult\":false,\"backdrop_path\":\"/tUBN1paMQ1tmVA5Sjy1ZjPWVsiF.jpg\",\"genre_ids\":[12,16,35,10751,14],\"id\":676701,\"original_language\":\"es\",\"original_title\":\"TadeoJones3:LaTablaEsmeralda\",\"overview\":\"Tadwouldloveforhisarcheologistcolleaguestoaccepthimasoneoftheirown,buthealwaysmesseseverythingup.Tadaccidentallydestroysasarcophagusandunleashesanancientspellendangeringthelivesofhisfriends:Mummy,JeffandBelzoni.WitheveryoneagainsthimandonlyhelpedbySara,hesetsoffonanadventurethatwilltakehimfromMexicotoChicagoandfromParistoEgypt,inordertoputanendtothecurseoftheMummy.\",\"popularity\":1853.126,\"poster_path\":\"/jvIVl8zdNSOAJImw1elQEzxStMN.jpg\",\"release_date\":\"2022-08-24\",\"title\":\"TadtheLostExplorerandtheEmeraldTablet\",\"video\":false,\"vote_average\":7.9,\"vote_count\":75},{\"adult\":false,\"backdrop_path\":\"/5GA3vV1aWWHTSDO5eno8V5zDo8r.jpg\",\"genre_ids\":[27,53],\"id\":760161,\"original_language\":\"en\",\"original_title\":\"Orphan:FirstKill\",\"overview\":\"AfterescapingfromanEstonianpsychiatricfacility,LeenaKlammertravelstoAmericabyimpersonatingEsther,themissingdaughterofawealthyfamily.Butwhenhermaskstartstoslip,sheisputagainstamotherwhowillprotectherfamilyfromthemurderous“child”atanycost.\",\"popularity\":1093.742,\"poster_path\":\"/pHkKbIRoCe7zIFvqan9LFSaQAde.jpg\",\"release_date\":\"2022-07-27\",\"title\":\"Orphan:FirstKill\",\"video\":false,\"vote_average\":6.8,\"vote_count\":1293},{\"adult\":false,\"backdrop_path\":\"/1DBDwevWS8OhiT3wqqlW7KGPd6m.jpg\",\"genre_ids\":[53],\"id\":985939,\"original_language\":\"en\",\"original_title\":\"Fall\",\"overview\":\"ForbestfriendsBeckyandHunter,lifeisallaboutconqueringfearsandpushinglimits.Butaftertheyclimb2,000feettothetopofaremote,abandonedradiotower,theyfindthemselvesstrandedwithnowaydown.NowBeckyandHunter’sexpertclimbingskillswillbeputtotheultimatetestastheydesperatelyfighttosurvivetheelements,alackofsupplies,andvertigo-inducingheights\",\"popularity\":1192.07,\"poster_path\":\"/spCAxD99U1A6jsiePFoqdEcY0dG.jpg\",\"release_date\":\"2022-08-11\",\"title\":\"Fall\",\"video\":false,\"vote_average\":7.3,\"vote_count\":1740},{\"adult\":false,\"backdrop_path\":\"/y4XBYLldCLuNLVeObTndfAaUrc3.jpg\",\"genre_ids\":[28,80,53],\"id\":896485,\"original_language\":\"fr\",\"original_title\":\"Overdose\",\"overview\":\"CaptainSaraBellaiche,fromToulouseJudiciaryPolicebranch,isinvestigatingago-fastlinkedtothemurderoftwoteenagers,aninvestigationledbyRichardCross,fromtheParisCriminalBrigade.Forcedtocollaborateinordertofindthemurdererandstopthebloodygo-fast,SaraandRichardareboththrowninabreathlessraceagainsttheclockontheroadsofSpainandFrance.\",\"popularity\":1073.538,\"poster_path\":\"/9RvM4wawLRlX608FgZr9kL8CLmy.jpg\",\"release_date\":\"2022-11-04\",\"title\":\"Overdose\",\"video\":false,\"vote_average\":6.6,\"vote_count\":75},{\"adult\":false,\"backdrop_path\":\"/hNzrnsH9FMMfITu2xQqaf70CRv5.jpg\",\"genre_ids\":[9648,14,53],\"id\":856245,\"original_language\":\"es\",\"original_title\":\"MataralaBestia\",\"overview\":\"EmiliaarrivesatherAuntInés'hostellocatedontheArgentina-Brazilborder,lookingforhermissingbrother.Inthislushjungleadangerousbeastwhichtakestheformofdifferentanimalsseemstoberoamingaround.\",\"popularity\":1053.707,\"poster_path\":\"/hAdkgE8lHelIQWpgrHk4wjEnbxQ.jpg\",\"release_date\":\"2022-04-28\",\"title\":\"ToKilltheBeast\",\"video\":false,\"vote_average\":6,\"vote_count\":17},{\"adult\":false,\"backdrop_path\":\"/tIX6j3NzadlwGcJ52nuWdmtOQkg.jpg\",\"genre_ids\":[27,53,9648],\"id\":717728,\"original_language\":\"en\",\"original_title\":\"JeepersCreepers:Reborn\",\"overview\":\"Forcedtotravelwithherboyfriendtoahorrorfestival,LainebeginstoexperiencedisturbingvisionsassociatedwiththeurbanlegendofTheCreeper.Asthefestivalarrivesandtheblood-soakedentertainmentbuildstoafrenzy,shebecomesthecenterofitwhilesomethingunearthlyhasbeensummoned.\",\"popularity\":1072.973,\"poster_path\":\"/qVVegwPsW6n9unBtLWq1rzOutka.jpg\",\"release_date\":\"2022-09-15\",\"title\":\"JeepersCreepers:Reborn\",\"video\":false,\"vote_average\":5.8,\"vote_count\":458},{\"adult\":false,\"backdrop_path\":\"/nnUQqlVZeEGuCRx8SaoCU4XVHJN.jpg\",\"genre_ids\":[14,12,10751],\"id\":532639,\"original_language\":\"en\",\"original_title\":\"Pinocchio\",\"overview\":\"Awoodenpuppetembarksonathrillingadventuretobecomearealboy.\",\"popularity\":813.164,\"poster_path\":\"/g8sclIV4gj1TZqUpnL82hKOTK3B.jpg\",\"release_date\":\"2022-09-07\",\"title\":\"Pinocchio\",\"video\":false,\"vote_average\":6.7,\"vote_count\":1074},{\"adult\":false,\"backdrop_path\":\"/cvOHMfZTxIiNI9yyjYgYfCpT48p.jpg\",\"genre_ids\":[28,80,53],\"id\":944864,\"original_language\":\"nl\",\"original_title\":\"TheTakeover\",\"overview\":\"Self-proclaimedethicalhackerMelBandison'slifeisturnedupsidedownwhenshestopsadatabreachonahigh-techself-drivingbusthatalsohappenstoshutdownaninternationalcriminalnetwork.Shethenbecomesatargetandisframedwithadeepfakevideothat“shows”thatshemurderssomeone.\",\"popularity\":806.325,\"poster_path\":\"/g7rdcofib7HqdlDP1LT7Hmf1f2o.jpg\",\"release_date\":\"2022-11-01\",\"title\":\"TheTakeover\",\"video\":false,\"vote_average\":5.7,\"vote_count\":65},{\"adult\":false,\"backdrop_path\":\"/akYTfFvYkFGJReFxXM841NidlAa.jpg\",\"genre_ids\":[80,18],\"id\":1033107,\"original_language\":\"en\",\"original_title\":\"WildIstheWind\",\"overview\":\"Whentwocorruptpoliceofficersinvestigatethebrutalmurderofayounggirl,tensionscometoaheadintheirsmall,racially-segregatedtown.\",\"popularity\":699.111,\"poster_path\":\"/rITxQBtnMpneZf8QzH1dqONQocx.jpg\",\"release_date\":\"2022-10-28\",\"title\":\"WildIstheWind\",\"video\":false,\"vote_average\":5.8,\"vote_count\":30},{\"adult\":false,\"backdrop_path\":\"/iS9U3VHpPEjTWnwmW56CrBlpgLj.jpg\",\"genre_ids\":[14,35,10751],\"id\":642885,\"original_language\":\"en\",\"original_title\":\"HocusPocus2\",\"overview\":\"29yearssincetheBlackFlameCandlewaslastlit,the17th-centurySandersonsistersareresurrected,andtheyarelookingforrevenge.Nowit'suptothreehighschoolstudentstostoptheravenouswitchesfromwreakinganewkindofhavoconSalembeforedawnonAllHallow'sEve.\",\"popularity\":843.776,\"poster_path\":\"/7ze7YNmUaX81ufctGqt0AgHxRtL.jpg\",\"release_date\":\"2022-09-27\",\"title\":\"HocusPocus2\",\"video\":false,\"vote_average\":7.5,\"vote_count\":1104}]}" localhost/api/goods/save-items
// curl -X GET localhost/api/goods/get-items


