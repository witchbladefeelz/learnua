import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { progressAPI, lessonsAPI, achievementsAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { 
  BookOpenIcon, 
  TrophyIcon, 
  FireIcon,
  ChartBarIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface DashboardStats {
  completedLessons: number;
  totalLessons: number;
  completionRate: number;
  totalXPGained: number;
  averageAccuracy: number;
  activeDays: number;
}

interface StreakInfo {
  currentStreak: number;
  isActiveToday: boolean;
  nextMilestone: number;
}

const Dashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [recentLessons, setRecentLessons] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [progressData, streakData, lessonsData, achievementsData] = await Promise.all([
        progressAPI.getProgress(),
        progressAPI.getStreak(),
        lessonsAPI.getMy(),
        achievementsAPI.getMy(),
      ]);

      // Type cast the responses since our API interceptor returns response.data
      const progressResponse = progressData as any;
      const streakResponse = streakData as any;
      const lessonsResponse = (lessonsData as unknown) as any[];
      const achievementsResponse = (achievementsData as unknown) as any[];

      setStats(progressResponse?.stats || {});
      setStreak(streakResponse || {});
      setRecentLessons((lessonsResponse || []).slice(0, 6));
      setAchievements((achievementsResponse || []).slice(0, 3));

      // Update user data if needed
      if (progressResponse?.user) {
        updateUser(progressResponse.user);
      }
    } catch (error: any) {
      toast.error(t('dashboard.loadingError'));
      console.error('Dashboard data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t('dashboard.welcomeBack')}, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Continue learning Ukrainian language
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mx-auto">
            <BookOpenIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats?.completedLessons || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.stats.lessonsCompleted')}</div>
          </div>
        </Card>

        <Card className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center mx-auto">
            <TrophyIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.xp || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.stats.xp')}</div>
          </div>
        </Card>

        <Card className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto">
            <FireIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {streak?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.stats.streak')}</div>
          </div>
        </Card>

        <Card className="text-center space-y-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {stats?.averageAccuracy || 0}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overall Progress */}
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Overall Progress
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t('dashboard.stats.level')} {user?.level}
              </span>
            </div>

            <div className="space-y-4">
              <ProgressBar
                value={stats?.completedLessons || 0}
                max={stats?.totalLessons || 1}
                label="Lessons Completed"
                color="primary"
              />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                    {stats?.completionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-300">
                    {stats?.activeDays || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Active Days</div>
                </div>
              </div>
            </div>

            <Link to="/lessons">
              <Button fullWidth leftIcon={<PlayIcon className="w-4 h-4" />}>
                {t('dashboard.continueStudying')}
              </Button>
            </Link>
          </div>
        </Card>

        {/* Streak Info */}
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Streak System
              </h3>
              <FireIcon className="w-6 h-6 text-orange-500" />
            </div>

            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-orange-500">
                🔥 {streak?.currentStreak || 0}
              </div>
              <div className="text-lg text-gray-900 dark:text-gray-100">
                {streak?.isActiveToday ? 'You studied today!' : 'Study today!'}
              </div>
              
              {streak && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Until next reward: {streak.nextMilestone - streak.currentStreak} days
                  </div>
                  <ProgressBar
                    value={streak.currentStreak}
                    max={streak.nextMilestone}
                    color="warning"
                    showPercentage={false}
                  />
                </div>
              )}
            </div>

            {!streak?.isActiveToday && (
              <Link to="/lessons">
                <Button variant="outline" fullWidth>
                  Study Today
                </Button>
              </Link>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Lessons */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('dashboard.recentLessons')}
            </h3>
            <Link to="/lessons">
              <Button variant="ghost" size="small">
                All Lessons
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentLessons.map((lesson) => (
              <Card key={lesson.id} className="space-y-3" padding="small">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.category}</p>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-500/10 dark:text-primary-200 px-2 py-1 rounded">
                    {lesson.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    +{lesson.xpReward} XP
                  </span>
                  <Link to={`/lessons/${lesson.id}`}>
                    <Button size="small">
                      {lesson.completedBy?.length > 0 ? 'Review' : 'Start'}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('dashboard.recentAchievements')}
              </h3>
              <Link to="/profile">
                <Button variant="ghost" size="small">
                  All Achievements
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl">{achievement.achievement.icon}</div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{achievement.achievement.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{achievement.achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
