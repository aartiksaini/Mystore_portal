const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true
  },
  razorpay_payment_id: {
    type: String,
    required: true
  },
  razorpay_signature: {
    type: String,
    required: true
  },
  orderedProductId: {
    type: Schema.Types.ObjectId,
    ref: 'OrderedProducts',
    // required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
