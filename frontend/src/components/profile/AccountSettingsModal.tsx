import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import toast from 'react-hot-toast';

import Button from '../ui/Button';
import { usersAPI } from '../../services/api';
import { User } from '../../types';
import { useTranslation } from '../../contexts/LanguageContext';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string | null;
  initialEmail: string;
  onProfileUpdated: (user: User) => void;
}

const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  initialName,
  initialEmail,
  onProfileUpdated,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const [name, setName] = useState(initialName ?? '');
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedInitialEmail = useMemo(() => initialEmail?.toLowerCase().trim(), [initialEmail]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setName(initialName ?? '');
      setEmail(initialEmail);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialName, initialEmail]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error(t('accountSettings.toastEmailEmpty'));
      return;
    }
    const nameChanged = trimmedName !== (initialName?.trim() ?? '');
    const emailChanged = normalizedEmail !== normalizedInitialEmail;
    const wantsPasswordChange = Boolean(newPassword || confirmPassword);

    if (!nameChanged && !emailChanged && !wantsPasswordChange) {
      toast(t('accountSettings.toastNoChanges'), { icon: 'ℹ️' });
      return;
    }

    if (wantsPasswordChange) {
      if (!newPassword || !confirmPassword) {
        toast.error(t('accountSettings.toastEnterNewPassword'));
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error(t('accountSettings.toastPasswordMismatch'));
        return;
      }
      if (newPassword.length < 6) {
        toast.error(t('accountSettings.toastPasswordTooShort'));
        return;
      }
    }

    if ((emailChanged || wantsPasswordChange) && !currentPassword) {
      toast.error(t('accountSettings.toastCurrentPasswordRequired'));
      return;
    }

    const payload: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};

    if (nameChanged) {
      payload.name = trimmedName;
    }

    if (emailChanged) {
      payload.email = normalizedEmail;
      payload.currentPassword = currentPassword;
    }

    if (wantsPasswordChange) {
      payload.newPassword = newPassword;
      payload.currentPassword = currentPassword;
    }

    try {
      setIsSubmitting(true);
      const updatedUser = await usersAPI.updateProfile(payload);
      onProfileUpdated(updatedUser);

      if (emailChanged) {
        toast.success(t('accountSettings.toastEmailUpdated'));
      } else if (wantsPasswordChange) {
        toast.success(t('accountSettings.toastPasswordUpdated'));
      } else {
        toast.success(t('accountSettings.toastProfileUpdated'));
      }

      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('accountSettings.toastProfileUpdateError');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-settings-heading"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="account-settings-heading"
              className="text-xl font-semibold text-gray-900 dark:text-gray-100"
            >
              {t('accountSettings.title')}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t('accountSettings.subtitle')}
            </p>
          </div>
          <Button variant="ghost" size="small" onClick={onClose} aria-label={t('accountSettings.close')}>
            ✕
          </Button>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-name">
                {t('accountSettings.displayName')}
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={50}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder={t('accountSettings.displayNamePlaceholder')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                placeholder="example@mail.com"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {t('accountSettings.emailHint')}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('accountSettings.securitySection')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-current-password">
                  {t('accountSettings.currentPassword')}
                </label>
                <input
                  id="profile-current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  placeholder={t('accountSettings.currentPasswordPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-new-password">
                  {t('accountSettings.newPassword')}
                </label>
                <input
                  id="profile-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  placeholder={t('accountSettings.newPasswordPlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profile-confirm-password">
                  {t('accountSettings.confirmPassword')}
                </label>
                <input
                  id="profile-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  placeholder={t('accountSettings.confirmPasswordPlaceholder')}
                />
              </div>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
              {t('accountSettings.saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default AccountSettingsModal;
