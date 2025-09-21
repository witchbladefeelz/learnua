import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrophyIcon, FireIcon, StarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { usersAPI } from '../services/api';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { LeaderboardUser } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageContainer from '../components/layout/PageContainer';

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLeaderboard = useCallback(async (silent: boolean = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const data = await usersAPI.getLeaderboard(20);
      setUsers(data);
    } catch (error: any) {
      toast.error(t('leaderboard.loadingError'));
      console.error('Leaderboard loading error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const animalEmojis = ['🐶','🐱','🦊','🦁','🐻','🐼','🐨','🐯','🐰','🦄','🐸','🐧','🐹','🐦','🦉','🐙','🦋','🐢'];

  const getFallbackEmoji = (id: string) => {
    if (!id) {
      return animalEmojis[0];
    }
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return animalEmojis[hash % animalEmojis.length];
  };

  const renderAvatar = (leader: LeaderboardUser, size: 'lg' | 'md' = 'md') => {
    const circleSize = size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
    const emojiSize = size === 'lg' ? 'text-3xl' : 'text-2xl';
    const ringThickness = size === 'lg' ? 'ring-4' : 'ring-2';

    if (leader.avatar) {
      return (
        <div className={`${circleSize} rounded-full overflow-hidden shadow-lg ${ringThickness} ring-white/40`}>
          <img
            src={leader.avatar}
            alt={leader.name || 'User avatar'}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div
        className={`flex items-center justify-center ${circleSize} ${emojiSize} rounded-full bg-gradient-to-br from-primary-500/80 to-secondary-500/80 text-white shadow-lg ${ringThickness} ring-white/40`}
      >
        <span>{getFallbackEmoji(leader.id)}</span>
      </div>
    );
  };

  const userPosition = useMemo(() => {
    if (!currentUser) return -1;
    return users.findIndex((user) => user.id === currentUser.id);
  }, [users, currentUser]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <div className="text-2xl">🥇</div>;
      case 1:
        return <div className="text-2xl">🥈</div>;
      case 2:
        return <div className="text-2xl">🥉</div>;
      default:
        return (
          <div className="w-8 h-8 bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-sm font-medium text-slate-200">
            {index + 1}
          </div>
        );
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 2:
        return 'bg-gradient-to-r from-orange-400 to-orange-500';
      default:
        return 'bg-white/5';
    }
  };

  const getProfileLink = (leaderId: string) =>
    currentUser?.id === leaderId ? '/profile' : `/users/${leaderId}`;

  if (loading) {
    return (
      <PageContainer>
        <div className="surface-panel flex items-center justify-center min-h-[320px]">
          <LoadingSpinner size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="surface-panel space-y-10 text-slate-100">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-amber-500/30">
          <TrophyIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold">
          {t('leaderboard.title')}
        </h1>
        <p className="text-lg text-slate-300">
          Best Ukrainian language learners
        </p>
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="small"
            onClick={() => loadLeaderboard(true)}
            loading={refreshing}
            leftIcon={<ArrowPathIcon className="w-4 h-4" />}
          >
            {t('leaderboard.refresh')}
          </Button>
        </div>
      </div>

      {users.length === 0 && (
        <Card className="text-center py-12 bg-white/5 border-white/10">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold">
            {t('leaderboard.noData')}
          </h2>
          <p className="text-slate-300 mt-2">
            {t('leaderboard.prompt')}
          </p>
        </Card>
      )}

      {/* Top 3 */}
      {users.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd place */}
          <Link to={getProfileLink(users[1].id)} className="block order-2 md:order-1">
            <Card className={`text-center space-y-4 ${getRankBg(1)} text-white transition-transform hover:scale-105 border border-white/20`}>
              <div className="text-3xl">🥈</div>
              <div className="flex justify-center">
                {renderAvatar(users[1], 'lg')}
              </div>
              <div>
                <div className="font-bold text-lg">{users[1].name || 'Student'}</div>
                <div className="text-sm opacity-90">{users[1].level}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{users[1].xp} XP</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FireIcon className="w-4 h-4" />
                    <span>{users[1].streak}</span>
                  </span>
                </div>
              </div>
            </Card>
          </Link>

          {/* 1st place */}
          <Link to={getProfileLink(users[0].id)} className="block order-1 md:order-2">
            <Card className={`text-center space-y-4 transform scale-105 ${getRankBg(0)} text-white transition-transform hover:scale-110 border border-white/20`}>
              <div className="text-4xl">🥇</div>
              <div className="flex justify-center">
                {renderAvatar(users[0], 'lg')}
              </div>
              <div>
                <div className="font-bold text-xl">{users[0].name || 'Student'}</div>
                <div className="text-sm opacity-90">{users[0].level}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <StarIcon className="w-5 h-5" />
                    <span className="font-bold">{users[0].xp} XP</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FireIcon className="w-5 h-5" />
                    <span className="font-bold">{users[0].streak}</span>
                  </span>
                </div>
              </div>
            </Card>
          </Link>

          {/* 3rd place */}
          <Link to={getProfileLink(users[2].id)} className="block order-3">
            <Card className={`text-center space-y-4 ${getRankBg(2)} text-white transition-transform hover:scale-105 border border-white/20`}>
              <div className="text-3xl">🥉</div>
              <div className="flex justify-center">
                {renderAvatar(users[2], 'lg')}
              </div>
              <div>
                <div className="font-bold text-lg">{users[2].name || 'Student'}</div>
                <div className="text-sm opacity-90">{users[2].level}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{users[2].xp} XP</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FireIcon className="w-4 h-4" />
                    <span>{users[2].streak}</span>
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card className="bg-white/5 border-white/10">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">
            Full Ranking
          </h3>
          
          <div className="space-y-2">
            {users.map((leader, index) => {
              const isCurrent = currentUser?.id === leader.id;
              const background = index < 3 ? 'bg-white/8 border border-white/10' : 'hover:bg-white/8 border border-transparent';

              return (
              <Link
                  key={leader.id}
                  to={getProfileLink(leader.id)}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all backdrop-blur-sm ${background} ${
                    isCurrent ? 'ring-2 ring-primary-400/70' : ''
                  }`}
              >
                <div className="flex-shrink-0">
                  {getRankIcon(index)}
                </div>
                <div className="flex-shrink-0">
                  {renderAvatar(leader)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {leader.name || `Student ${leader.id.slice(-4)}`}
                  </div>
                  <div className="text-sm text-slate-400">{leader.level}</div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-slate-200/80">
                  <span className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4" />
                    <span>{leader.xp}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FireIcon className="w-4 h-4" />
                    <span>{leader.streak}</span>
                  </span>
                </div>
              </Link>
            );
            })}
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <div className="text-4xl mb-4">📊</div>
              <p>{t('leaderboard.noData')}</p>
            </div>
          )}
        </div>
      </Card>

      {currentUser && users.length > 0 && userPosition === -1 && (
        <Card className="bg-primary-500/10 border border-primary-500/30">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-sm uppercase font-semibold text-primary-200">
                {t('leaderboard.yourPosition')}
              </div>
              <div className="text-slate-200">
                {t('leaderboard.keepLearning')}
              </div>
            </div>
            <Button onClick={() => loadLeaderboard(true)} leftIcon={<ArrowPathIcon className="w-4 h-4" />}>
              {t('leaderboard.refreshAfter')}
            </Button>
          </div>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-gradient-to-br from-primary-500/10 via-transparent to-secondary-500/10 border border-white/10">
        <div className="text-center space-y-4 text-slate-200">
          <h3 className="text-lg font-semibold text-slate-100">
            How to get on the leaderboard?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div className="space-y-2">
              <div className="text-2xl">📚</div>
              <div>Complete lessons and earn XP</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🔥</div>
              <div>Maintain your daily streak</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl">🎯</div>
              <div>Aim for high accuracy</div>
            </div>
          </div>
        </div>
      </Card>
      </div>
    </PageContainer>
  );
};

export default Leaderboard;
