'use strict';
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('./src/utils/bodyParser')
const cashController = require('./src/controllers/finanzasController')

module.exports.handler = async (event, context) => {
  console.log(JSON.stringify(event))
  try {

    const object = bodyParser(event.body)
    const twiml = new MessagingResponse();
    if (object.Body.indexOf('--help') >= 0) {
      twiml.message(`Wellcome to PersonalAPI. Formats about what you wanna do: 🤘🤘`)
      twiml.message(`
      *SaveFinanzas:*\nCash + CATEGORY + AMOUNT + DESCRIPTION\nexample: "cash Comida 12000 Almuerzo"\n\n*Total Category:* Total + CATEGORY + DATE_AGO\nExample: "Total Transporte 5week"formats: 1week, 1month, 1Year`)
      twiml.message(`*Reminders:* \nReminder + DESCRIPTION \n example: "Reminder Llamar a pepe"`)
    } else if (object.Body.toLowerCase().indexOf("reminder") >= 0) {
      twiml.message("🍁🍁🍁🍁 \nReminder is not avilable yet, we're working hard with some drugs to give you this soon!! ")
    } else if (object.Body.toLowerCase().indexOf("total") >= 0) {
      let response = await cashController.listCategory(object)
      twiml.message(response)
    } else if (object.Body.toLowerCase().indexOf("cash") >= 0) {
      let response = await cashController.addRecord(object)
      twiml.message(response)
    } else {
      twiml.message(` 
      Sorry 🤯, i dont have idea what you want to do. Greetings 
      `)
    }
    let xml = twiml.toString()
    context.done(null, { body: xml });
  } catch (e) {
    console.log(e)
    return "something fails with this shit!"
  }

};