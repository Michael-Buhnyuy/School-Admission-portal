import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CreditCard, Building, Smartphone, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Payment.css';

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user } = useAuth();

  const paymentMethods = [
    { id: 'card', icon: CreditCard, label: 'Credit/Debit Card' },
    { id: 'bank', icon: Building, label: 'Bank Transfer' },
    { id: 'ussd', icon: Smartphone, label: 'USSD' },
  ];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="payment-success">
          <motion.div 
            className="success-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Payment Successful!</h2>
            <p>Your registration fee has been processed successfully.</p>
            <div className="receipt-details">
              <div className="receipt-row">
                <span>Application ID:</span>
                <span>{user?.applicationId || 'APP-2024-001'}</span>
              </div>
              <div className="receipt-row">
                <span>Amount Paid:</span>
                <span>15000FCFA</span>
              </div>
              <div className="receipt-row">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="receipt-row">
                <span>Transaction ID:</span>
                <span>TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
              </div>
            </div>
            <Link to="/applicant" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-header">
        <Link to="/applicant" className="back-link">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
        <h1>Registration Fee Payment</h1>
      </div>

      <div className="payment-content">
        <motion.div 
          className="payment-summary"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Payment Summary</h3>
          <div className="summary-card">
            <div className="summary-item">
              <span>Registration Fee</span>
              <span className="amount">10.000FCFA</span>
            </div>
            <div className="summary-item">
              <span>Application Fee</span>
              <span className="amount">5.000FCFA</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span>Total Amount</span>
              <span className="amount">15.000FCFA</span>
            </div>
          </div>

          <div className="payment-guarantee">
            <Lock size={16} />
            <span>Secure payment powered by encrypted connection</span>
          </div>
        </motion.div>

        <motion.div 
          className="payment-methods"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Select Payment Method</h3>
          
          <div className="methods-grid">
            {paymentMethods.map(method => (
              <div 
                key={method.id}
                className={`method-option ${selectedMethod === method.id ? 'selected' : ''}`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <method.icon size={24} />
                <span>{method.label}</span>
                {selectedMethod === method.id && <CheckCircle className="check-icon" />}
              </div>
            ))}
          </div>

          {selectedMethod === 'card' && (
            <div className="card-form">
              <div className="input-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input type="text" placeholder="123" />
                </div>
              </div>
              <div className="input-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
            </div>
          )}

          {selectedMethod === 'bank' && (
            <div className="bank-details">
              <p>Please transfer the total amount to:</p>
              <div className="bank-info">
                <div className="info-row">
                  <span>Bank Name:</span>
                  <span>First Bank of Nigeria</span>
                </div>
                <div className="info-row">
                  <span>Account Name:</span>
                  <span>Excellence Academy</span>
                </div>
                <div className="info-row">
                  <span>Account Number:</span>
                  <span>1234567890</span>
                </div>
              </div>
              <p className="note">Upload your payment receipt after transfer</p>
            </div>
          )}

          {selectedMethod === 'ussd' && (
            <div className="ussd-details">
              <p>Dial the USSD code below on your mobile phone:</p>
              <div className="ussd-code">
                *123*BANK*1234567890*150#
              </div>
              <p className="note">Enter your transaction PIN to complete payment</p>
            </div>
          )}

          <button 
            className="btn btn-primary btn-lg" 
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Pay $150.00'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
