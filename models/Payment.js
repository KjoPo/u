const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  country: String,
  address: String,
  zipCode: String,
  city: String,
  cardNumber: String,
  expirationDate: String,
  cvv: String,
  otpAttempts: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);