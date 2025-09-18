export const en = {
  // Navigation
  nav: {
    home: 'Home',
    lessons: 'Lessons',
    achievements: 'Achievements',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    admin: 'Admin',
    logout: 'Logout'
  },

  // Auth
  auth: {
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    loginSuccess: 'Successfully logged in!',
    registerSuccess: 'Successfully registered!',
    loginError: 'Login error',
    registerError: 'Registration error',
    registerCheckEmail: 'You can sign in immediately after registering.',
    verificationRequired: 'Email verification is not required.',
    verificationEmailSent: 'Email verification is disabled.',
    resendVerification: 'Send verification email',
    resendVerificationHint: '',
    verificationSuccess: 'Email verification is disabled.',
    verificationError: 'Email verification is disabled.',
    emailVerifiedLabel: 'Email verified',
    emailNotVerifiedLabel: 'Verification disabled',
    enterEmailForResend: ''
  },

  accountSettings: {
    title: 'Account Settings',
    subtitle: 'Update your display name, email, or password. Current password is required when changing email or password.',
    close: 'Close settings',
    displayName: 'Display name',
    displayNamePlaceholder: 'Enter your name',
    emailHint: 'Use your new email address to sign in. Current password is needed to confirm the change.',
    securitySection: 'Security',
    currentPassword: 'Current password',
    currentPasswordPlaceholder: 'Enter current password',
    newPassword: 'New password',
    newPasswordPlaceholder: 'Enter new password',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Repeat new password',
    saveChanges: 'Save changes',
    toastEmailUpdated: 'Email updated. Use the new address next time you sign in.',
    toastPasswordUpdated: 'Password updated successfully.',
    toastProfileUpdated: 'Profile updated successfully.',
    toastProfileUpdateError: 'Could not update profile',
    toastEmailEmpty: 'Email cannot be empty.',
    toastNoChanges: 'No changes to save.',
    toastEnterNewPassword: 'Enter and confirm the new password.',
    toastPasswordMismatch: 'Passwords do not match.',
    toastPasswordTooShort: 'New password must be at least 6 characters.',
    toastCurrentPasswordRequired: 'Enter your current password to confirm changes.',
  },

  // Home Page
  home: {
    title: 'UAlearn · Ukrainian that sticks',
    subtitle: 'Daily practice, thoughtful pacing, and clear milestones.',
    heroBadge: 'Ukrainian for curious minds',
    heroTitle: 'Learn Ukrainian with clear structure and steady momentum',
    heroDescription: 'Daily lessons, instant feedback, and adaptive review cycles guide you from basics to confident conversation.',
    heroOrbCaption: 'Experience that feels calm, focused, and intentional',
    getStarted: 'Begin learning',
    alreadyHaveAccount: 'Back for another session?',
    featuresTitle: 'Learn smarter, not harder',
    featuresHeadline: 'Tools built for meaningful progress',
    featuresDescription: 'Practice, track, and celebrate improvement with a system designed to keep you moving forward.',
    features: {
      interactive: {
        title: 'Guided practice',
        description: 'Exercises that mirror real conversations and situations'
      },
      gamification: {
        title: 'Progress you can feel',
        description: 'Earn XP, reach new levels, and keep your streak alive'
      },
      progress: {
        title: 'Clarity at a glance',
        description: 'See what you’ve mastered and what needs more review'
      },
      community: {
        title: 'Learners like you',
        description: 'Friendly competition and encouragement on the leaderboard'
      },
      free: {
        title: 'Learn on your terms',
        description: 'Full access without paywalls or hidden upgrades'
      },
      adaptive: {
        title: 'Adaptive paths',
        description: 'Lesson plans shift as your skills grow'
      }
    },
    categoriesTitle: 'Lesson categories',
    categoriesHeadline: 'Real contexts, real vocabulary',
    categoriesDescription: 'Build language that fits daily life — greetings, travel, food, family, and more.',
    categories: {
      greetings: {
        title: 'Greetings',
        description: 'Set the tone for every conversation'
      },
      food: {
        title: 'Food & drinks',
        description: 'Order, cook, and share meals with confidence'
      },
      family: {
        title: 'Family',
        description: 'Talk about the people closest to you'
      },
      travel: {
        title: 'Travel',
        description: 'Navigate new cities and transport with ease'
      },
      numbers: {
        title: 'Numbers',
        description: 'Counting and mathematics'
      },
      colors: {
        title: 'Colors',
        description: 'Describe what you see with nuance'
      }
    },
    ctaTitle: 'Ready when you are',
    ctaDescription: 'Open the first lesson, meet curious learners, and let Ukrainian become part of your day.'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcomeBack: 'Welcome back',
    stats: {
      xp: 'XP',
      streak: 'Streak',
      level: 'Level',
      lessonsCompleted: 'Lessons Completed'
    },
    recentLessons: 'Recent Lessons',
    recentAchievements: 'Recent Achievements',
    continueStudying: 'Continue Studying',
    noLessons: 'No completed lessons yet',
    noAchievements: 'No achievements yet',
    loadingError: 'Error loading dashboard data'
  },

  // Lessons
  lessons: {
    title: 'Lessons',
    allLessons: 'All Lessons',
    byCategory: 'By Category',
    byLevel: 'By Level',
    start: 'Start',
    continue: 'Continue',
    completed: 'Completed',
    xpReward: 'XP Reward',
    exercisesCount: 'exercises',
    score: 'Score: {score}%',
    noLessons: 'No lessons found',
    loadingError: 'Error loading lessons'
  },

  // Lesson
  lesson: {
    question: 'Question',
    nextQuestion: 'Next Question',
    checkAnswer: 'Check Answer',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    completed: 'Lesson Completed!',
    earnedXP: 'You earned {xp} XP',
    finish: 'Finish Lesson',
    backToLessons: 'Back to Lessons',
    exercise: {
      multipleChoice: 'Choose the correct answer',
      textInput: 'Enter the translation',
      wordOrder: 'Arrange words in the correct order'
    }
  },

  // Achievements
  achievements: {
    title: 'Achievements',
    myAchievements: 'My Achievements',
    allAchievements: 'All Achievements',
    progress: 'Progress',
    unlocked: 'Unlocked',
    locked: 'Locked',
    noAchievements: 'You don\'t have any achievements yet',
    loadingError: 'Error loading achievements'
  },

  // Leaderboard
  leaderboard: {
    title: 'Leaderboard',
    rank: 'Rank',
    name: 'Name',
    xp: 'XP',
    level: 'Level',
    you: 'You',
    noData: 'No data to display',
    loadingError: 'Error loading leaderboard',
    refresh: 'Refresh',
    prompt: 'Complete your first lesson to appear on the leaderboard.',
    yourPosition: 'Your position',
    keepLearning: 'Keep learning to join the top students!',
    refreshAfter: 'Refresh after studying'
  },

  publicProfile: {
    title: 'Learner profile',
    subtitle: 'Learning journey of {name}',
    anonName: 'Learner',
    stats: {
      level: 'Level',
      xp: 'XP',
      streak: 'Streak',
      lessons: 'Lessons completed',
      achievements: 'Achievements',
      memberSince: 'Member since',
      lastActive: 'Last active'
    },
    lastActiveNever: 'No activity yet',
    achievementsTitle: 'Recent achievements',
    achievementsEmpty: 'No achievements yet.',
    lessonsTitle: 'Recent lessons',
    lessonsEmpty: 'No lessons completed yet.',
    lessonsScore: 'Score',
    lessonsXP: 'XP',
    backToLeaderboard: 'Back to leaderboard',
    notFound: 'Profile not available.',
    loadError: 'Unable to load learner profile.',
    lessonFallback: 'Lesson',
  },

  admin: {
    title: 'Admin dashboard',
    subtitle: 'Manage learners and monitor progress.',
    refresh: 'Refresh',
    backToApp: 'Back to dashboard',
    usersTitle: 'Users',
    searchPlaceholder: 'Search by email or name',
    searchAction: 'Search',
    columns: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      level: 'Level',
      verified: 'Verified',
      actions: 'Actions',
    },
    verified: 'Verified',
    notVerified: 'Not verified',
    editUser: 'Edit',
    viewProfile: 'View profile',
    emptyState: 'No users match your search.',
    toastLoadError: 'Failed to load users.',
    toastUpdateSuccess: 'User updated.',
    toastUpdateError: 'Failed to update user.',
    editingUserTitle: 'Editing {email}',
    editingUserSubtitle: 'Adjust stats, role, or verification state.',
    fields: {
      name: 'Display name',
      email: 'Email',
      level: 'Level',
      role: 'Role',
      emailVerified: 'Email verified',
      password: 'New password',
      passwordPlaceholder: 'Leave blank to keep current password',
      passwordHint: 'Minimum 8 characters.',
    },
    saveUser: 'Save user',
  },

  // Profile
  profile: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    statistics: 'Statistics',
    settings: 'Settings',
    accountSettings: 'Account settings',
    save: 'Save',
    saved: 'Saved!',
    saveError: 'Save error',
    language: 'Language'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    search: 'Search'
  },

  verifyEmail: {
    title: 'Email Verification',
    disabledTitle: 'No Verification Needed',
    disabledMessage: 'Email verification is disabled. You can sign in immediately after registering.',
    backToHome: 'Back to home',
    goToLogin: 'Go to login'
  },

  // Levels
  levels: {
    A1: 'Beginner A1',
    A2: 'Elementary A2',
    B1: 'Intermediate B1',
    B2: 'Upper-Intermediate B2',
    C1: 'Advanced C1',
    C2: 'Proficient C2'
  },

  // Categories
  categories: {
    GREETINGS: 'Greetings',
    FOOD: 'Food & Drinks',
    FAMILY: 'Family',
    TRAVEL: 'Travel',
    NUMBERS: 'Numbers',
    COLORS: 'Colors',
    ANIMALS: 'Animals',
    WEATHER: 'Weather',
    TIME: 'Time',
    CLOTHING: 'Clothing'
  }
};
