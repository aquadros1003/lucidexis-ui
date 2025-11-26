import { useState } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { useNavigate } from 'react-router-dom';
import { LogoIcon, LockIcon, MessageIcon, EyeOnIcon, EyeOffIcon, UserIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './Register.scss';

function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { registerAsync, isLoading, isError, error } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }
    if (!agreeToTerms) {
      return;
    }
    try {
      await registerAsync({
        email: email,
        password: password,
        full_name: fullName,
      });
      navigate('/signin');
    } catch {
      // Error handling is managed by useRegister hook
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="register-container">
      <div className="auth-header">
        <div className="auth-logo">
          <LogoIcon />
        </div>
        <h1 className="auth-app-name">{t('app.name')}</h1>
        <p className="auth-tagline">{t('app.title')}</p>
      </div>
      <div className="register-card">
        <div className="register-form-container">
          <h2 className="register-title">{t('signUp.createAccount')}</h2>
          <p className="register-subtitle">{t('signUp.signUpSubtitle')}</p>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                {t('signUp.fullName')}
              </label>
              <div className="input-wrapper">
                <UserIcon className="input-icon" />
                <input
                  type="text"
                  id="fullName"
                  className="form-input"
                  placeholder={t('signUp.fullNamePlaceholder')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('signUp.emailAddress')}
              </label>
              <div className="input-wrapper">
                <MessageIcon className="input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder={t('signUp.emailAddressPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t('signUp.password')}
              </label>
              <div className="input-wrapper">
                <LockIcon className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder={t('signUp.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                {t('signUp.confirmPassword')}
              </label>
              <div className="input-wrapper">
                <LockIcon className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  placeholder={t('signUp.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOnIcon /> : <EyeOffIcon />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <div className="error-text">{t('signUp.passwordMismatch')}</div>
              )}
            </div>

            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <span>
                  {t('signUp.acceptTerms')}{' '}
                  <a href="#" className="link-primary">
                    {t('signUp.termsofService')}
                  </a>{' '}
                  {t('signUp.and')}{' '}
                  <a href="#" className="link-primary">
                    {t('signUp.privacyPolicy')}
                  </a>
                </span>
              </label>
            </div>

            {isError && error && <div className="error-message">{t('errors.somethingWentWrong')}</div>}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || password !== confirmPassword || !agreeToTerms}
            >
              {isLoading ? t('signUp.creatingAccount') : t('signUp.createAccount')}
            </button>

            <div className="signin-prompt">
              {t('signUp.alreadyHaveAccount')}{' '}
              <button type="button" onClick={handleSignIn} className="link-button">
                {t('signUp.signIn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
