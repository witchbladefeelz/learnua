import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useTranslation } from '../../contexts/LanguageContext';

const VerifyEmail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100">
      <Card
        className="max-w-md w-full text-center space-y-6 bg-white/90 dark:bg-gray-900/85 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur p-8"
        hover={false}
      >
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-semibold">{t('verifyEmail.disabledTitle')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('verifyEmail.disabledMessage')}</p>
        <div className="flex flex-col gap-3 mt-4">
          <Button fullWidth onClick={() => navigate('/login')}>
            {t('verifyEmail.goToLogin')}
          </Button>
          <Button variant="ghost" fullWidth onClick={() => navigate('/') }>
            {t('verifyEmail.backToHome')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmail;
