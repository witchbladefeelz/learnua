import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { usersAPI } from '../services/api';
import { PublicUserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage, useTranslation } from '../contexts/LanguageContext';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dateFormatter = useMemo(() => {
    const locale = language === 'uk' ? 'uk-UA' : 'en-US';
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  }, [language]);

  useEffect(() => {
    if (!id) {
      return;
    }

    if (currentUser?.id === id) {
      navigate('/profile', { replace: true });
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await usersAPI.getUser(id);
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err?.response?.data?.message || err?.message || t('publicProfile.loadError');
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [id, currentUser?.id, navigate, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-6 text-gray-900 dark:text-gray-100">
        <Card className="max-w-lg w-full text-center space-y-4 p-8">
          <div className="text-4xl">🤔</div>
          <h1 className="text-2xl font-semibold">{t('publicProfile.notFound')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error || t('publicProfile.loadError')}</p>
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t('publicProfile.backToLeaderboard')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const displayName = profile.name?.trim() || t('publicProfile.anonName');
  const achievements = [...(profile.achievements || [])]
    .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
    .slice(0, 6);
  const lessons = [...(profile.completedLessons || [])]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 6);

  const memberSince = dateFormatter.format(new Date(profile.createdAt));
  const lastActive = profile.lastActiveDate
    ? dateFormatter.format(new Date(profile.lastActiveDate))
    : t('publicProfile.lastActiveNever');

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            {t('publicProfile.title')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('publicProfile.subtitle', { name: displayName })}
          </p>
        </div>
      </div>

      <Card className="p-6 md:p-8" padding="none">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar || 'https://cdn.jsdelivr.net/gh/identicons/jasonlong/png/128/default.png'}
              alt={displayName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-white shadow-lg dark:border-gray-700"
            />
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{displayName}</h2>
              <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-300">
                  {t('publicProfile.stats.level')}: {profile.level}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-500/10 text-secondary-700 dark:text-secondary-300">
                  {t('publicProfile.stats.memberSince')}: {memberSince}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  {t('publicProfile.stats.lastActive')}: {lastActive}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <Card className="text-center shadow-none border border-gray-200 dark:border-gray-700" hover={false} padding="small">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {t('publicProfile.stats.xp')}
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-300">{profile.xp}</div>
            </Card>
            <Card className="text-center shadow-none border border-gray-200 dark:border-gray-700" hover={false} padding="small">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {t('publicProfile.stats.streak')}
              </div>
              <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-300">🔥 {profile.streak}</div>
            </Card>
            <Card className="text-center shadow-none border border-gray-200 dark:border-gray-700" hover={false} padding="small">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {t('publicProfile.stats.lessons')}
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{profile.completedLessons?.length ?? 0}</div>
            </Card>
            <Card className="text-center shadow-none border border-gray-200 dark:border-gray-700" hover={false} padding="small">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400">
                {t('publicProfile.stats.achievements')}
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">{profile.achievements?.length ?? 0}</div>
            </Card>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {t('publicProfile.achievementsTitle')}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {profile.achievements?.length ?? 0}
            </span>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🌱</div>
              <p>{t('publicProfile.achievementsEmpty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="text-2xl">{item.achievement.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.achievement.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{item.achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {t('publicProfile.lessonsTitle')}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {profile.completedLessons?.length ?? 0}
            </span>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">📘</div>
              <p>{t('publicProfile.lessonsEmpty')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map(completed => (
                <div key={completed.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {completed.lesson?.title || t('publicProfile.lessonFallback')}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(completed.completedAt).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    <span>
                      {t('publicProfile.lessonsScore')}: {completed.score}%
                    </span>
                    <span>
                      {t('publicProfile.lessonsXP')}: {completed.xpEarned}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="flex justify-center">
        <Link to="/leaderboard">
          <Button variant="outline">{t('publicProfile.backToLeaderboard')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default UserProfile;
