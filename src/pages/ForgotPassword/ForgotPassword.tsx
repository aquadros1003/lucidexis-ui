import { useState } from 'react';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.scss';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const { forgotPasswordAsync, isLoading, isError, isSuccess, error } = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await forgotPasswordAsync(email);
    } catch {
      // Error handling is managed by useForgotPassword hook
    }
  };

  const handleBackToLogin = () => {
    navigate('/signin');
  };

  if (isSuccess) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-form-container">
            <div className="success-icon">✓</div>
            <h2 className="forgot-password-title">Check Your Email</h2>
            <p className="forgot-password-subtitle">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="forgot-password-info">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
            <button type="button" className="btn-primary" onClick={handleBackToLogin}>
              Back to Login
            </button>
            <div className="resend-info">
              Didn't receive the email? Check your spam folder or try again.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-form-container">
          <div className="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lock-icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="forgot-password-title">Forgot Password?</h2>
          <p className="forgot-password-subtitle">
            No worries, we'll send you reset instructions
          </p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isError && error && (
              <div className="error-message">
                {error.message}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="back-to-login">
              <button type="button" onClick={handleBackToLogin} className="link-button">
                ← Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
