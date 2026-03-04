import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../../contexts';
import { useUpdateUserProfile, useModelPreferences, useUpdateModelPreferences } from '../../hooks/useUpdateProfile';
import './ProfileSettings.scss';
import { UserIcon, SettingsIcon, SparkleIcon, EyeOnIcon, EyeOffIcon } from '../../assets/icons';

export function ProfileSettings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuthContext();

  const [fullName, setFullName] = useState('');
  const [locale, setLocale] = useState(user?.locale || 'en_US');

  const [llmModel, setLlmModel] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('');
  const [openaiSystemPrompt, setOpenaiSystemPrompt] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();
  const { data: modelPreferences, isLoading: isLoadingPreferences } = useModelPreferences();
  const { mutate: updatePreferences, isPending: isUpdatingPreferences } = useUpdateModelPreferences();

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      const userLocale = user.locale || (i18n.language === 'pl' ? 'pl_PL' : 'en_US');
      setLocale(userLocale);
    }
  }, [user, i18n.language]);

  useEffect(() => {
    if (modelPreferences) {
      setLlmModel(modelPreferences.llm_model || '');
      setOpenaiApiKey(modelPreferences.openai_api_key || '');
      setOpenaiBaseUrl(modelPreferences.openai_api_url || '');
      setOpenaiSystemPrompt(modelPreferences.openai_system_prompt || '');
    }
  }, [modelPreferences]);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    const lang = locale.startsWith('pl') ? 'pl' : 'en';
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }

    updateProfile({
      full_name: fullName,
      locale: locale,
    });

    updatePreferences({
      llm_model: llmModel,
      openai_api_key: openaiApiKey,
      openai_api_url: openaiBaseUrl,
      openai_system_prompt: openaiSystemPrompt,
    });
  };

  const isLoading = isUpdatingProfile || isUpdatingPreferences || isLoadingPreferences;

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-card">
        <div className="profile-settings-title-section">
          <button className="btn-save-changes" onClick={handleSaveChanges} disabled={isLoading}>
            <SettingsIcon />
            {t('common:profileSettings.saveChanges')}
          </button>
        </div>
        <form onSubmit={handleSaveChanges} className="profile-settings-form">
          <div className="settings-section">
            <div className="section-header">
              <UserIcon className="profile-settings-icon" />
              <h2 className="section-title">{t('common:profileSettings.personalInformation')}</h2>
            </div>
            <div className="profile-settings-form__group">
              <label htmlFor="fullName" className="profile-settings-form__label">
                {t('common:profileSettings.fullName')}
              </label>
              <input
                type="text"
                id="fullName"
                className="profile-settings-form__input"
                placeholder={t('common:profileSettings.fullNamePlaceholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="email" className="profile-settings-form__label">
                {t('common:profileSettings.email')}
              </label>
              <input
                type="email"
                id="email"
                className="profile-settings-form__input"
                value={user?.email || ''}
                disabled
              />
              <p className="form-helper-text">{t('common:profileSettings.emailCannotBeChanged')}</p>
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="locale" className="profile-settings-form__label">
                {t('common:profileSettings.languageAndLocale')}
              </label>
              <select
                id="locale"
                className="profile-settings-form__select"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                <option value="en_US">English (US)</option>
                <option value="pl_PL">Polski (PL)</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <SparkleIcon className="profile-settings-icon" />
              <h2 className="section-title">{t('common:profileSettings.aiLlmPreferences')}</h2>
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="openaiApiKey" className="profile-settings-form__label">
                {t('common:profileSettings.openaiApiKey')}
              </label>
              <div className="profile-settings-form__input-wrapper">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="openaiApiKey"
                  className="profile-settings-form__input"
                  placeholder={t('common:profileSettings.openaiApiKeyPlaceholder')}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                />
                <button
                  type="button"
                  className="profile-settings-form__icon-button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  {showApiKey ? <EyeOffIcon /> : <EyeOnIcon />}
                </button>
              </div>
              <p className="form-helper-text">{t('common:profileSettings.apiKeyHelperText')}</p>
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="openaiBaseUrl" className="profile-settings-form__label">
                {t('common:profileSettings.openaiBaseUrl')}
              </label>
              <input
                type="text"
                id="openaiBaseUrl"
                className="profile-settings-form__input"
                placeholder={t('common:profileSettings.openaiBaseUrlPlaceholder')}
                value={openaiBaseUrl}
                onChange={(e) => setOpenaiBaseUrl(e.target.value)}
              />
              <p className="form-helper-text">{t('common:profileSettings.baseUrlHelperText')}</p>
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="llmModel" className="profile-settings-form__label">
                {t('common:profileSettings.llmModel')}
              </label>
              <input
                type="text"
                id="llmModel"
                className="profile-settings-form__input"
                placeholder={t('common:profileSettings.llmModelPlaceholder')}
                value={llmModel}
                onChange={(e) => setLlmModel(e.target.value)}
              />
            </div>

            <div className="profile-settings-form__group">
              <label htmlFor="systemPrompt" className="profile-settings-form__label">
                {t('common:profileSettings.systemPrompt')}
              </label>
              <textarea
                id="systemPrompt"
                className="profile-settings-form__textarea"
                placeholder={t('common:profileSettings.systemPromptPlaceholder')}
                value={openaiSystemPrompt}
                onChange={(e) => setOpenaiSystemPrompt(e.target.value)}
                rows={6}
              />
              <p className="form-helper-text">{t('common:profileSettings.systemPromptHelperText')}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileSettings;
