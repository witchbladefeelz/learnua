import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useTranslation } from '../contexts/LanguageContext';
import { lessonsAPI } from '../services/api';
import { Category, Lesson } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type LessonWithStatus = Lesson & {
  completedBy?: Array<{ id: string; score: number; completedAt: string }>;
};

const Lessons: React.FC = () => {
  const { t } = useTranslation();
  const [lessons, setLessons] = useState<LessonWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const categories = useMemo(() => [
    { value: 'ALL', label: t('lessons.allLessons') },
    { value: Category.GREETINGS, label: t('home.categories.greetings.title') },
    { value: Category.FOOD, label: t('home.categories.food.title') },
    { value: Category.FAMILY, label: t('home.categories.family.title') },
    { value: Category.TRAVEL, label: t('home.categories.travel.title') },
    { value: Category.NUMBERS, label: t('home.categories.numbers.title') },
    { value: Category.COLORS, label: t('home.categories.colors.title') },
  ], [t]);

  useEffect(() => {
    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter]);

  const loadLessons = async () => {
    setLoading(true);
    try {
      const categoryQuery = categoryFilter === 'ALL' ? undefined : categoryFilter;
      const data = await lessonsAPI.getMy(categoryQuery);
      setLessons(data);
    } catch (error) {
      console.error('Lessons loading error:', error);
      toast.error(t('lessons.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const displayedLessons = lessons;

  return (
    <div className="space-y-8 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          {t('lessons.title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t('lessons.byCategory')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setCategoryFilter(category.value)}
            className={`px-4 py-2 rounded-full border transition-colors text-sm font-medium ${
              categoryFilter === category.value
                ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : displayedLessons.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('lessons.noLessons')}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {t('lessons.loadingError')}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayedLessons.map((lesson) => {
            const exercisesCount = lesson.exercises?.length || 0;
            const isCompleted = Boolean(lesson.completedBy && lesson.completedBy.length > 0);
            const lastCompletion = lesson.completedBy?.[0];

            return (
              <Card key={lesson.id} className="h-full flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-300">
                      {lesson.category}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-secondary-600 dark:text-secondary-300">
                      {lesson.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {lesson.title}
                  </h3>
                  {lesson.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {lesson.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t('lessons.xpReward')}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{lesson.xpReward} XP</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{t('lessons.exercisesCount')}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{exercisesCount}</span>
                  </div>

                  {isCompleted && lastCompletion && (
                    <div className="text-xs text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/30 rounded-lg p-3">
                      <div className="font-semibold flex items-center gap-2">
                        ✅ {t('lessons.completed')}
                      </div>
                      <div className="mt-1 text-green-700 dark:text-green-200">
                        {t('lessons.score', { score: lastCompletion.score })}
                      </div>
                    </div>
                  )}

                  <Link to={`/lessons/${lesson.id}`}>
                    <Button
                      fullWidth
                      variant={isCompleted ? 'outline' : 'primary'}
                    >
                      {isCompleted ? t('lessons.continue') : t('lessons.start')}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Lessons;
