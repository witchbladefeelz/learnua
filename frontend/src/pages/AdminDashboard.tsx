import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { adminAPI } from '../services/api';
import { AdminUpdateUserPayload, AdminUserSummary, Level, UserRole } from '../types';
import { useTranslation } from '../contexts/LanguageContext';

const levels = Object.values(Level);
const roles = Object.values(UserRole);

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserSummary | null>(null);
  const [form, setForm] = useState<AdminUpdateUserPayload>({});

  const loadUsers = async (query?: string) => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers({ search: query });
      setUsers(data);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('admin.toastLoadError');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return users;
    }
    const term = search.trim().toLowerCase();
    return users.filter((user) =>
      [user.email, user.name].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [users, search]);

  const openEditor = (user: AdminUserSummary) => {
    setEditingUser(user);
    setForm({
      name: user.name ?? '',
      email: user.email,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      role: user.role,
      emailVerified: user.emailVerified,
      password: '',
    });
  };

  const closeEditor = () => {
    setEditingUser(null);
    setForm({});
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) {
      return;
    }

    setUpdating(true);
    try {
      const trimmedEmail = form.email?.trim();
      const trimmedPassword = form.password?.trim();

      const payload: AdminUpdateUserPayload = {
        name: typeof form.name === 'string' ? form.name : undefined,
        email: trimmedEmail || undefined,
        level: form.level,
        xp: form.xp,
        streak: form.streak,
        role: form.role,
        emailVerified: form.emailVerified,
      };

      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }
      const updated = await adminAPI.updateUser(editingUser.id, payload);
      setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));
      toast.success(t('admin.toastUpdateSuccess'));
      closeEditor();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || t('admin.toastUpdateError');
      toast.error(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">{t('admin.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => loadUsers(search)}>{t('admin.refresh')}</Button>
          <Link to="/dashboard">
            <Button variant="ghost">{t('admin.backToApp')}</Button>
          </Link>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold">{t('admin.usersTitle')}</h2>
          <div className="flex gap-3 items-center">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('admin.searchPlaceholder')}
              className="w-full md:w-72 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <Button
              variant="outline"
              onClick={() => loadUsers(search)}
            >
              {t('admin.searchAction')}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.name')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.email')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.role')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.level')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">XP</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">🔥</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.verified')}</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-300">{t('admin.columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{user.name || t('publicProfile.anonName')}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.role}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.level}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.xp}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.streak}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{user.emailVerified ? t('admin.verified') : t('admin.notVerified')}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => openEditor(user)}
                        >
                          {t('admin.editUser')}
                        </Button>
                        <Link to={user.id ? `/users/${user.id}` : '#'}>
                          <Button size="small" variant="ghost">
                            {t('admin.viewProfile')}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      {t('admin.emptyState')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editingUser &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeEditor}
            />
            <div className="relative z-10 w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('admin.editingUserTitle', { email: editingUser.email })}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('admin.editingUserSubtitle')}</p>
                </div>
                <Button variant="ghost" size="small" onClick={closeEditor}>
                  ✕
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.fields.name')}</label>
                    <input
                      type="text"
                      value={form.name ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.fields.email')}</label>
                    <input
                      type="email"
                      value={form.email ?? ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.fields.level')}</label>
                    <select
                      value={form.level ?? editingUser.level}
                      onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value as Level }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.fields.role')}</label>
                    <select
                      value={form.role ?? editingUser.role}
                      onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">XP</label>
                    <input
                      type="number"
                      min={0}
                      value={form.xp ?? editingUser.xp}
                      onChange={(event) => setForm((prev) => ({ ...prev, xp: Number(event.target.value) }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">🔥</label>
                    <input
                      type="number"
                      min={0}
                      value={form.streak ?? editingUser.streak}
                      onChange={(event) => setForm((prev) => ({ ...prev, streak: Number(event.target.value) }))}
                      className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="admin-email-verified"
                    type="checkbox"
                    checked={form.emailVerified ?? editingUser.emailVerified}
                    onChange={(event) => setForm((prev) => ({ ...prev, emailVerified: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="admin-email-verified" className="text-sm text-gray-700 dark:text-gray-300">
                    {t('admin.fields.emailVerified')}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('admin.fields.password')}</label>
                  <input
                    type="password"
                    value={form.password ?? ''}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder={t('admin.fields.passwordPlaceholder')}
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('admin.fields.passwordHint')}</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={closeEditor} disabled={updating}>
                    {t('common.cancel')}
                  </Button>
                  <Button type="submit" loading={updating} disabled={updating}>
                    {t('admin.saveUser')}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default AdminDashboard;
