import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { lessonsAPI, usersAPI } from '../services/api';
import { Exercise, ExerciseType, Lesson } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageContainer from '../components/layout/PageContainer';

interface LessonDetailData extends Lesson {
  exercises: Exercise[];
}

interface AnswerRecord {
  exerciseId: string;
  userAnswer: string;
  isCorrect: boolean;
}

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { updateUser } = useAuth();

  const [lesson, setLesson] = useState<LessonDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [completing, setCompleting] = useState<boolean>(false);
  const [completedLesson, setCompletedLesson] = useState<{ score: number; xpEarned: number } | null>(null);
  const [startedAt] = useState<number>(Date.now());


  useEffect(() => {
    if (!id) {
      navigate('/lessons');
      return;
    }

    loadLesson(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadLesson = async (lessonId: string) => {
    setLoading(true);
    try {
      const data = await lessonsAPI.getById(lessonId);
      const parsedExercises = (data.exercises || []).map((exercise) => ({
        ...exercise,
        options: parseExerciseOptions(exercise.options),
      }));

      const normalizedLesson: LessonDetailData = {
        ...data,
        exercises: parsedExercises,
      };

      setLesson(normalizedLesson);
      setCurrentIndex(0);
      setSelectedOption(null);
      setTextAnswer('');
      setAnswers([]);
      setShowFeedback(false);
      setCompletedLesson(null);
    } catch (error) {
      console.error('Lesson loading error:', error);
      toast.error(t('lessons.loadingError'));
      navigate('/lessons');
    } finally {
      setLoading(false);
    }
  };

  const currentExercise = useMemo(() => {
    if (!lesson) return null;
    return lesson.exercises[currentIndex] || null;
  }, [lesson, currentIndex]);

  const handleCheckAnswer = () => {
    if (!lesson || !currentExercise) {
      return;
    }

    let userAnswer = '';
    let isCorrect = false;

    if (currentExercise.type === ExerciseType.MULTIPLE_CHOICE) {
      if (!selectedOption) {
        toast.error(t('lesson.exercise.multipleChoice'));
        return;
      }
      userAnswer = selectedOption;
      isCorrect = normalizeString(userAnswer) === normalizeString(currentExercise.correctAnswer);
    } else if (currentExercise.type === ExerciseType.TEXT_INPUT) {
      if (!textAnswer.trim()) {
        toast.error(t('lesson.exercise.textInput'));
        return;
      }
      userAnswer = textAnswer.trim();
      isCorrect = normalizeString(userAnswer) === normalizeString(currentExercise.correctAnswer);
    } else {
      userAnswer = selectedOption || textAnswer || '';
      isCorrect = true;
      toast(t('lesson.exercise.wordOrder'), {
        icon: 'ℹ️',
      });
    }

    setAnswers((prev) => {
      const exists = prev.find((answer) => answer.exerciseId === currentExercise.id);
      if (exists) {
        return prev.map((answer) =>
          answer.exerciseId === currentExercise.id
            ? { ...answer, userAnswer, isCorrect }
            : answer
        );
      }
      return [...prev, { exerciseId: currentExercise.id, userAnswer, isCorrect }];
    });

    setIsCurrentCorrect(isCorrect);
    setShowFeedback(true);
  };

  const goToNextExercise = () => {
    if (!lesson) return;

    const isLast = currentIndex === lesson.exercises.length - 1;
    if (isLast) {
      completeLesson();
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setTextAnswer('');
    setShowFeedback(false);
    setIsCurrentCorrect(null);
  };

  const completeLesson = async () => {
    if (!lesson || completing) return;

    try {
      setCompleting(true);

      const totalExercises = lesson.exercises.length;
      const correctAnswers = answers.filter((answer) => answer.isCorrect).length;
      const score = Math.round((correctAnswers / totalExercises) * 100);
      const timeSpent = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      const answerValues = lesson.exercises.map((exercise) => {
        const answer = answers.find((item) => item.exerciseId === exercise.id);
        return answer?.userAnswer || '';
      });

      const response = await lessonsAPI.complete(lesson.id, {
        score,
        timeSpent,
        answers: answerValues,
      });

      toast.success(t('lesson.completed'));
      setCompletedLesson({
        score,
        xpEarned: response?.xpEarned ?? lesson.xpReward,
      });

      // Refresh user stats (XP, streak, level)
      try {
        const me = await usersAPI.getMe() as any;
        if (me) {
          updateUser({
            xp: me.xp,
            level: me.level,
            streak: me.streak,
          });
        }
      } catch (refreshError) {
        console.warn('Failed to refresh user data after lesson completion', refreshError);
      }
    } catch (error: any) {
      console.error('Lesson completion error:', error);
      toast.error(error.response?.data?.message || t('common.error'));
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  if (completedLesson) {
    return (
      <PageContainer>
        <div className="surface-panel max-w-3xl mx-auto space-y-10 text-slate-100">
          <div className="text-center space-y-6">
            <div className="text-5xl">🎉</div>
            <h1 className="text-3xl font-semibold">{t('lesson.completed')}</h1>
            <p className="text-lg text-slate-300">
              {t('lesson.earnedXP', { xp: completedLesson.xpEarned })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-100">
            <div className="rounded-xl p-4 bg-primary-500/10 border border-primary-500/30">
              <div className="text-xs font-semibold uppercase tracking-wide text-primary-200">
                {t('lessons.score', { score: completedLesson.score })}
              </div>
              <div className="text-2xl font-bold text-primary-200 mt-1">
                {completedLesson.score}%
              </div>
            </div>
            <div className="rounded-xl p-4 bg-secondary-500/10 border border-secondary-500/30">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary-200">
                {t('lessons.xpReward')}
              </div>
              <div className="text-2xl font-bold text-secondary-200 mt-1">
                {completedLesson.xpEarned} XP
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/lessons">
              <Button>{t('lesson.backToLessons')}</Button>
            </Link>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              {t('dashboard.continueStudying')}
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!currentExercise) {
    return null;
  }

  return (
    <PageContainer>
      <div className="surface-panel max-w-3xl mx-auto space-y-8 text-slate-100">
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-lg text-slate-300">{lesson.description}</p>
          )}
          <div className="text-sm text-slate-400">
            {currentIndex + 1} / {lesson.exercises.length}
          </div>
        </div>

        <Card className="space-y-6 bg-white/5 border-white/10">
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('lesson.question')} {currentIndex + 1}</h2>
            <p className="text-lg text-slate-100">{currentExercise.question}</p>
          </div>

          {currentExercise.type === ExerciseType.MULTIPLE_CHOICE && currentExercise.options && (
            <div className="grid grid-cols-1 gap-3">
              {currentExercise.options.map((option, index) => (
                <button
                  key={`${option}-${index}`}
                  onClick={() => setSelectedOption(option)}
                  className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                    selectedOption === option
                      ? 'border-primary-500 bg-primary-500/10 text-primary-200'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
                  }`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentExercise.type === ExerciseType.TEXT_INPUT && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('lesson.exercise.textInput')}
              </label>
              <input
                type="text"
                value={textAnswer}
                onChange={(event) => setTextAnswer(event.target.value)}
                disabled={showFeedback}
                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-slate-900/60 text-slate-100"
                placeholder={t('lesson.exercise.textInput')}
              />
            </div>
          )}

          {showFeedback && isCurrentCorrect !== null && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                isCurrentCorrect
                  ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/30'
                  : 'bg-red-500/10 text-red-200 border border-red-400/30'
              }`}
            >
              {isCurrentCorrect ? '✅ ' + t('lesson.correct') : '❌ ' + t('lesson.incorrect')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/lessons')}
              disabled={completing}
            >
              {t('lesson.backToLessons')}
            </Button>

            {showFeedback ? (
              <Button onClick={goToNextExercise} loading={completing}>
                {currentIndex === lesson.exercises.length - 1
                  ? t('lesson.finish')
                  : t('lesson.nextQuestion')}
              </Button>
            ) : (
              <Button onClick={handleCheckAnswer}>
                {t('lesson.checkAnswer')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

const parseExerciseOptions = (options: Exercise['options']): string[] | undefined => {
  if (!options) {
    return undefined;
  }

  if (Array.isArray(options)) {
    return options.map(String);
  }

  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : undefined;
    } catch (error) {
      console.warn('Failed to parse options', error);
      return undefined;
    }
  }

  return undefined;
};

const normalizeString = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

export default LessonDetail;
