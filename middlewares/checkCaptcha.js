const checkCaptcha = (req, res, next) => {
    // In a real app, you would verify this server-side
    // For demo, we'll just check for the header
    if (!req.headers['x-captcha-verified']) {
      return res.status(403).json({ 
        error: 'CAPTCHA verification required',
        redirect: '/verify'
      });
    }
    next();
  };
  module.exports={checkCaptcha}