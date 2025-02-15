const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  accountType:{
    type: String,
    required: true
  },
  ordered_products: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderedProducts'
  }],
  refunded_products: [{
    type: Schema.Types.ObjectId,
    ref: 'OrderedProducts'
  }],
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Cart'
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
