const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },
    quantity: {
        type: Number,
        required: true
    },
    record: {
        type: Schema.Types.ObjectId,
        ref: 'records'
    }
})

module.exports = mongoose.model('orders', OrderSchema);