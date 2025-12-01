import { useState } from 'react';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { useNavigate } from 'react-router-dom';
import { MessageIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './ForgotPassword.scss';
import { LanguageSelect } from '../../components/LanguageSelect';

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  if (isSuccess) {
    return (
      <div className="forgot-password-container">
        <div className="auth-header__top-right">
          <LanguageSelect />
        </div>
        <div className="forgot-password-card">
          <div className="forgot-password-form-container">
            <div className="success-icon">✓</div>
            <h2 className="forgot-password-title">{t('forgotPassword.checkYourEmail')}</h2>
            <p className="forgot-password-subtitle">
              {t('forgotPassword.sentPasswordInstructions')} <strong>{email}</strong>
            </p>
            <p className="forgot-password-info">{t('forgotPassword.didntReceiveEmail')}</p>
            <button type="button" className="btn-primary" onClick={() => navigate('/signin')}>
              {t('forgotPassword.backToSignIn')}
            </button>
            <div className="resend-info">{t('forgotPassword.resendEmail')}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="auth-header__top-right">
        <LanguageSelect />
      </div>
      <div className="forgot-password-card">
        <div className="forgot-password-form-container">
          <div className="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="lock-icon">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="forgot-password-title">{t('forgotPassword.title')}</h2>
          <p className="forgot-password-subtitle">{t('forgotPassword.subtitle')}</p>
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('forgotPassword.emailAddress')}
              </label>
              <div className="input-wrapper">
                <MessageIcon className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder={t('forgotPassword.emailAddressPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {isError && error && <div className="error-message">{t('errors.somethingWentWrong')}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading || !email}>
              {isLoading ? t('forgotPassword.sendingResetLink') : t('forgotPassword.sendResetLink')}
            </button>

            <div className="back-to-login">
              <button type="button" onClick={() => navigate('/signin')} className="link-button">
                ← {t('forgotPassword.backToSignIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
