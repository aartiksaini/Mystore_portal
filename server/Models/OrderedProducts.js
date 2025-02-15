const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderedProductsSchema = new Schema({
  product: {
    type: Object,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  status: {
    type: String,
    enum: ['ordered', 'refunded'],
    required: true
  }
});

const OrderedProducts = mongoose.model('OrderedProducts', orderedProductsSchema);
module.exports = OrderedProducts;
