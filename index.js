const express = require('express');
const dialogflow = require('dialogflow-fulfillment');
//const functions = require('firebase-functions');
//const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
    res.send("live now!!");

    
});

app.post('/', express.json(), async (req, res) => {

    const agent = new dialogflow.WebhookClient({
        request: req,
        response: res
    });

    // Extract order ID from webhook request
    const orderId = req.body.queryResult.parameters.number;

    const response = await axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', { orderId: orderId });
    


    const shipmentDate = response.data.shipmentDate;

    
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
        agent.add(`Your Order ${orderId} will be shipped on ${formattedShipmentDate}`);
        var payload = {
                "richResponse": {
                  "items": [
                    {
                    "simpleResponse": {
                        "textToSpeech": "<speak>Here are <say-as interpet-as=\"characters\">SSML</say-as> examples.Here is a buzzing fly <audio src=\"https://actions.google.com/sounds/v1/animals/buzzing_fly.ogg\"></audio>and here's a short pause <break time=\"800ms\"/></speak>"
                      }
                    },
                    {
                        "basicCard": {
                            "title": "Title: this is a title",
                            "subtitle": "This is a subtitle",
                            "formattedText": "This is a basic card.  Text in a basic card can include \"quotes\" and\n    most other unicode characters including emojis.  Basic cards also support\n    some markdown formatting like *emphasis* or _italics_, **strong** or\n    __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other\n    things like line  \nbreaks",
                            "image": {
                            "url": "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                            "accessibilityText": "Image alternate text"
                            },
                            "buttons": [
                            {
                                "title": "This is a button",
                                "openUrlAction": {
                                "url": "https://assistant.google.com/"
                                }
                            }
                            ],
                            "imageDisplayOptions": "CROPPED"
                        }
                    },
                    {
                      "simpleResponse": {
                        "textToSpeech": "Which response would you like to see next?"
                      }
                    }
                  ]
                }
              
            
            }
          agent.add( new dialogflow.Payload(agent.UNSPECIFIED, payload,{ sendAsMessage: true, rawPayload: true}));
    };

    let intentMap = new Map();

    intentMap.set('Get orderId', shipDate);

    //intentMap.set('last msg', playAudio);
    // agent.intent('SSML', (conv) => {
    //     conv.ask(`<speak>` +
    //       `Here are <say-as interpet-as="characters">SSML</say-as> examples.` +
    //       `Here is a buzzing fly ` +
    //       `<audio src="https://actions.google.com/sounds/v1/animals/buzzing_fly.ogg"></audio>` +
    //       `and here's a short pause <break time="800ms"/>` +
    //       `</speak>`);
    //     conv.ask('Which response would you like to see next?');
    //   });

    agent.handleRequest(intentMap);

});





app.listen(8080, () => {
    console.log('live at port 8080 or not')
});