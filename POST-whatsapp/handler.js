'use strict';
require('dotenv').config()
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('./src/utils/bodyParser')
const cashController = require('./src/controllers/finanzasController')


const handler = async (event, context) => {
  // module.exports.handler = async (event, context) => {
  // console.log(JSON.stringify(event))
  try {
    let object

    if (['test', 'prod'].includes(process.env.NODE_ENV))
      object = bodyParser(event.body)
    else
      object = {
        From: process.env.TEST_PHONE_NUMBER,
        Body: process.env.BODY_REQUEST,
        To: "123"
      }

    let twiml
    if (process.env.NODE_ENV == 'dev')
      twiml = { message: response => console.log(response) }
    else
      twiml = new MessagingResponse();

    if (object.Body.toLowerCase().indexOf("reminder") >= 0) {
      twiml.message("🍁🍁🍁🍁 \nReminder is not avilable yet, we're working hard with some drugs to give you this soon!! ")
    } else if (object.Body.toLowerCase().indexOf("total+less") >= 0) {
      console.log('here');

      let response = await cashController.substractCategories(object)
      twiml.message(response)
    } else if (object.Body.toLowerCase().indexOf("total+sum") >= 0) {
      let response = await cashController.sumCategories(object)
      twiml.message(response)
    } else if (object.Body.toLowerCase().indexOf("total") >= 0) {
      let response = await cashController.listCategory(object)
      twiml.message(response)
    } else if (object.Body.toLowerCase().indexOf("cash+update") >= 0) {
      let response = await cashController.updateCategory(object)
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

handler({}, { done: () => process.exit(0) })