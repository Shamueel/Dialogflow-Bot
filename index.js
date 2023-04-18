const express = require('express');
const dialogflow = require('dialogflow-fulfillment');
//const functions = require('firebase-functions');
//const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
    res.send("live now!!",play());

    function play() {
        var audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.play();
      }

    
});

app.post('/', express.json(), async (req, res) => {

    const agent = new dialogflow.WebhookClient({
        request: req,
        response: res
    });

    // Extract order ID from webhook request
    const orderId = req.body.queryResult.parameters.number;
    console.log(orderId)
    console.log('ye wala')

    const response = await axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', { orderId: orderId });
    //console.log("api: ",response);    


    const shipmentDate = response.data.shipmentDate;
    //console.log(shipmentDate)
    
    const formattedShipmentDate = new Date(shipmentDate).toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    console.log(formattedShipmentDate)
    function shipDate(agent) {
        agent.add(`Your Order ${orderId} will be shipped on ${formattedShipmentDate}`);
    }

    function playAudio(agent) {
        let text_to_speech = '<speak>'
          + '<audio src="https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg"></audio>. '
          + '</speak>'
        agent.add(text_to_speech);
        agent.add('webhook 1');
    };

    let intentMap = new Map();

    intentMap.set('Get orderId', shipDate);
    //intentMap.set('last msg', playAudio);

    agent.handleRequest(intentMap);

});



app.listen(8080, () => {
    console.log('live at port 8080 or not')
});