const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
    total: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['CANCEL', 'DONE', 'PREPARE', 'SHIP']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = mongoose.model('records', RecordSchema);