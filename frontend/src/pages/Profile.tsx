import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  CameraIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  TrophyIcon,
  CheckCircleIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageContainer from '../components/layout/PageContainer';
import AccountSettingsModal from '../components/profile/AccountSettingsModal';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { usersAPI, achievementsAPI, progressAPI } from '../services/api';

interface AchievementItem {
  id: string;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
  unlockedAt: string;
}

const defaultAvatar = 'https://cdn.jsdelivr.net/gh/identicons/jasonlong/png/128/default.png';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const normalizeProfile = useCallback((data: any) => ({
    ...data,
    avatar: data?.avatar || defaultAvatar,
    name: data?.name || data?.email || 'Learner',
  }), []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, achievementsData, progressData] = await Promise.all([
        usersAPI.getMe(),
        achievementsAPI.getMy().catch(() => []),
        progressAPI.getProgress().catch(() => null),
      ]);

      setProfile(normalizeProfile(profileData));
      setAchievements((achievementsData as AchievementItem[]) || []);
      setStats(progressData || null);
    } catch (error) {
      toast.error('Unable to load profile data');
      console.error('Profile load error', error);
    } finally {
      setLoading(false);
    }
  }, [normalizeProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleProfileUpdated = (updatedUser: any) => {
    const normalized = normalizeProfile(updatedUser);
    setProfile(normalized);
    updateUser({
      name: normalized.name,
      avatar: normalized.avatar,
      email: updatedUser.email,
      emailVerified: updatedUser.emailVerified,
      xp: updatedUser.xp,
      level: updatedUser.level,
      streak: updatedUser.streak,
    });
  };
 
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setSaving(true);
      const updated = await usersAPI.uploadAvatar(formData);
      const normalized = normalizeProfile(updated);
      setProfile(normalized);
      updateUser({ avatar: normalized.avatar, name: normalized.name });
      toast.success('Avatar updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update avatar');
    } finally {
      setSaving(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const completedAchievementCount = useMemo(() => achievements.length, [achievements]);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <PageContainer contentClassName="space-y-8">
      <AccountSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialName={profile?.name}
        initialEmail={profile?.email || user?.email || ''}
        onProfileUpdated={handleProfileUpdated}
      />

      <div className="surface-panel space-y-10 text-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile?.avatar || defaultAvatar}
                alt={profile?.name || user?.email || 'User avatar'}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              />
              {saving && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                  <LoadingSpinner size="small" color="white" />
                </div>
              )}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-2 -right-2 bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-full shadow-md transition-colors"
              >
                <CameraIcon className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold">
                {profile?.name || user?.email || t('profile.title')}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4" />
                  {user?.email}
                </span>
                {user?.emailVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-200">
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {t('auth.emailVerifiedLabel')}
                  </span>
                )}
                <span className="px-2 py-0.5 text-xs font-semibold bg-primary-500/10 text-primary-200 rounded-full">
                  {profile?.level || user?.level}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={() => setIsSettingsOpen(true)}
              leftIcon={<CogIcon className="w-4 h-4" />}
            >
              {t('profile.accountSettings')}
            </Button>
            <Button variant="ghost" onClick={loadProfile} leftIcon={<ArrowPathIcon className="w-4 h-4" />}>
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center space-y-2">
            <div className="text-sm uppercase font-semibold text-primary-200">XP</div>
            <div className="text-3xl font-bold">{profile?.xp ?? user?.xp ?? 0}</div>
          </Card>
          <Card className="text-center space-y-2">
            <div className="text-sm uppercase font-semibold text-secondary-200">Streak</div>
            <div className="text-3xl font-bold">🔥 {profile?.streak ?? user?.streak ?? 0}</div>
          </Card>
          <Card className="text-center space-y-2">
            <div className="text-sm uppercase font-semibold text-emerald-200">Lessons</div>
            <div className="text-3xl font-bold">{stats?.stats?.completedLessons ?? 0}</div>
          </Card>
          <Card className="text-center space-y-2">
            <div className="text-sm uppercase font-semibold text-amber-200">Achievements</div>
            <div className="text-3xl font-bold">{completedAchievementCount}</div>
          </Card>
        </div>

        <Card className="p-6 space-y-6 bg-white/5 border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-yellow-400" />
              Recent Achievements
            </h2>
            <span className="text-sm text-slate-400">
              {completedAchievementCount} unlocked
            </span>
          </div>

          {achievements.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-2">🎯</div>
              <p>{t('achievements.noAchievements')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="text-2xl">{item.achievement.icon}</div>
                  <div>
                    <div className="font-medium text-slate-100">{item.achievement.name}</div>
                    <div className="text-sm text-slate-300">{item.achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
