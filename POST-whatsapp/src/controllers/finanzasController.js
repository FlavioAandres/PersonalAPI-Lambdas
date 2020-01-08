const mongodb = require('../database/mongo')
const boxflowModel = require('../models/boxflow')
const moment = require('moment')

module.exports = {
    addRecord: async (request) => {
        try {
            await mongodb.connect()
        } catch (error) {
            console.error('error trying to connect with mongo' + error)
            return "Error trying to connect with database"
        }

        let { From, To, Body } = request
        if (!From || !To, !Body) return "Ey! Some params are missing"

        let [task, category, amount, ...description] = Body.split("+")
        description = description.join(" ")
        console.log(task, category, amount, description);

        category = category ? category.split("/") : []

        let object = {
            phoneNumber: From,
            secondCategory: category[1],
            category: category[0],
            amount,
            description
        }

        try {
            let result = await boxflowModel.create(object)
            console.log(JSON.stringify(result))
            // await mongodb.destroy()
        } catch (error) {
            console.log(error)
            return "Something saving in database"
        }
        return "Ok, i've saved this purchase"
    },
    listCategory: async (request) => {
        try {
            await mongodb.connect()
        } catch (error) {
            console.error('error trying to connect with mongo' + error)
            return "Error trying to connect with database"
        }

        let { From, To, Body } = request
        if (!From || !To, !Body) return "Ey! Some params are missing"

        let [task, category, timeAgo] = Body.split("+")

        console.log(task, category, timeAgo);
        let timeNumber = timeAgo.match(/[0-100]/)[0]
        let long = timeAgo.match(/[a-zA-Z]/)[0]

        if (!timeNumber || !long)
            return "Error de capa 8 - Timming ago fails"
        let date = moment().subtract(timeNumber, long)

        console.log(timeNumber, long, date)
        let query = {
            phoneNumber: From,
            category,
            createdDate: {
                $gte: new Date(date)
            }
        }

        try {
            // return JSON.stringify(query)
            let result = await boxflowModel.find(query, { description: 1, amount: 1, category: 1 })
            if (!result || !result.length)
                return "⚠ No encontré datos 🙅‍♀️"

            let data = "👽 Resumen de " + category + "\n"
            data += result.reduce((prev, current, idx) => {
                prev += `${idx + 1}-${current.description}: $${current.amount}\n`
                return prev
            }, "")

            data += "*Total:* $" + result.reduce((prev, current, index) => {
                prev += current.amount
                return prev
            }, 0)

            return data
        } catch (error) {
            console.log(error)
            return "Something fails with mongo"
        }
    }
}