import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { LogoIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import { EyeOffIcon, EyeOnIcon, LockIcon, MessageIcon } from '../../assets/icons';
import './Login.scss';

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginAsync, isLoading, isError, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginAsync({
        username: email,
        password: password,
      });
    } catch {
      // Error handling is managed by useLogin hook
    }
  };
  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/forgot-password');
  };

  return (
    <div className="login-container">
      <div className="auth-header">
        <div className="auth-logo">
          <LogoIcon />
        </div>
        <h1 className="auth-app-name">{t('common:app.name')}</h1>
        <p className="auth-tagline">{t('common:app.title')}</p>
      </div>
      <div className="login-card">
        <div className="login-form-container">
          <h2 className="welcome-title">{t('common:signIn.welcomeBack')}</h2>
          <p className="welcome-subtitle">{t('common:signIn.signInSubtitle')}</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('common:signIn.emailAddress')}
              </label>
              <div className="input-wrapper">
                <MessageIcon className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder={t('common:signIn.emailAddressPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password" className="form-label">
                  {t('common:signIn.password')}
                </label>
                <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                  {t('common:signIn.forgotPassword')}
                </a>
              </div>
              <div className="input-wrapper">
                <LockIcon className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder={t('common:signIn.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
                </button>
              </div>
            </div>
            {isError && error && (
              <div
                className="error-message"
                style={{
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  fontSize: '0.875rem',
                }}
              >
                {t('common:signIn.invalidCredentials')}
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? t('common:signIn.signingIn') : t('common:signIn.signIn')}
            </button>
            <div className="divider">
              <span>{t('common:signIn.orLabel')}</span>
            </div>
            <button type="button" className="btn-secondary" onClick={handleSignUp}>
              {t('common:signIn.signUp')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
