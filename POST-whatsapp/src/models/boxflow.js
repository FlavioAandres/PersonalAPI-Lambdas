const { Schema, model } = require('mongoose')

const schema = {
    phoneNumber: { type: String, required: true },
    category: { type: String, required: true },
    secondCategory: { type: String, required: false },
    description: { type: String, required: false },
    amount: { type: Number, required: true },
    createdAt: { type: Date, },
    updatedAt: { type: Date, }
}

const options = {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
}

module.exports = model('boxflows', new Schema(schema, options)) 