export const COLLECTIONS = {
  STUDENTS: 'students',
  CLASSES: 'classes',
  ATTENDANCE: 'attendance',
  TUITIONS: 'tuitions',
  POSTS: 'posts',
  // USERS: 'users',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
