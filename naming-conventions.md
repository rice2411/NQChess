# Quy tắc đặt tên file trong dự án Next.js

## 1. Components (PascalCase)

```
src/components/
  ├── Button/
  │   ├── Button.tsx
  │   ├── Button.styles.ts
  │   └── Button.test.tsx
  ├── UserProfile/
  │   ├── UserProfile.tsx
  │   └── index.ts
  └── Layout/
      ├── Header.tsx
      ├── Footer.tsx
      └── Sidebar.tsx
```

## 2. Pages & App Router (kebab-case)

```
src/app/
  ├── page.tsx
  ├── layout.tsx
  ├── about/
  │   └── page.tsx
  ├── blog/
  │   ├── page.tsx
  │   └── [slug]/
  │       └── page.tsx
  └── user-profile/
      └── page.tsx
```

## 3. Hooks (camelCase)

```
src/hooks/
  ├── useAuth.ts
  ├── useLocalStorage.ts
  └── react-query/
      ├── student/
      │   ├── useStudentQuery.ts
      │   └── studentQueryKey.ts
      └── teacher/
          ├── useTeacherQuery.ts
          └── teacherQueryKey.ts
```

## 4. Services (camelCase + dot notation)

```
src/services/
  ├── auth/
  │   ├── auth.service.ts
  │   ├── auth.types.ts
  │   └── auth.utils.ts
  └── api/
      ├── student.api.ts
      └── teacher.api.ts
```

## 5. Utils & Helpers (camelCase)

```
src/utils/
  ├── formatDate.ts
  ├── validation.ts
  └── constants/
      ├── routes.ts
      └── config.ts
```

## 6. Types & Interfaces (PascalCase + dot notation)

```
src/types/
  ├── common/
  │   ├── entity.interface.ts
  │   └── response.type.ts
  └── domain/
      ├── User.interface.ts
      └── Student.type.ts
```

## 7. Constants (SCREAMING_SNAKE_CASE cho giá trị, camelCase cho file)

```
src/constants/
  ├── apiEndpoints.ts  // export const API_BASE_URL = '...'
  └── errorMessages.ts // export const ERROR_NOT_FOUND = '...'
```

## 8. Configs (camelCase + dot notation)

```
src/config/
  ├── firebase.config.ts
  ├── api.config.ts
  └── theme.config.ts
```

## 9. Store/State Management (camelCase)

```
src/store/
  ├── slices/
  │   ├── userSlice.ts
  │   └── authSlice.ts
  └── hooks/
      └── useAppDispatch.ts
```

## 10. Styles (camelCase + dot notation)

```
src/styles/
  ├── global.styles.ts
  ├── theme.styles.ts
  └── components/
      └── button.styles.ts
```

## 11. API Routes (kebab-case)

```
src/app/api/
  ├── auth/
  │   └── login/
  │       └── route.ts
  └── users/
      └── [id]/
          └── route.ts
```

## 12. Tests (giống tên file gốc + .test/spec)

```
src/__tests__/
  ├── components/
  │   └── Button.test.tsx
  └── utils/
      └── formatDate.spec.ts
```

## Quy tắc chung

### 1. PascalCase

- Components
- Interfaces/Types
- Class definitions

### 2. camelCase

- Hooks
- Functions
- Variables
- Instances
- File utilities

### 3. kebab-case

- URLs
- Routes
- Folder names trong app router

### 4. SCREAMING_SNAKE_CASE

- Constants
- Environment variables
- Action types

### 5. dot notation

- File extensions (.service.ts, .types.ts, .utils.ts)
- Test files (.test.ts, .spec.ts)
- Style files (.styles.ts)

## Lưu ý quan trọng

1. Luôn tạo file `index.ts` để export các components/functions
2. Đặt tên file trùng với tên component/function chính trong file
3. Nhóm các file liên quan vào cùng một thư mục
4. Sử dụng các tiền tố/hậu tố có ý nghĩa:
   - `use` cho hooks (ví dụ: useAuth)
   - `Service` cho services (ví dụ: authService)
   - `.types` cho type definitions
   - `.utils` cho utility functions
   - `.styles` cho style files
   - `.test` hoặc `.spec` cho test files

## Ví dụ về cách đặt tên

### Components

```typescript
// ✅ Đúng
UserProfile.tsx
Button.styles.ts
Header.component.tsx

// ❌ Sai
userProfile.tsx
buttonStyles.ts
header_component.tsx
```

### Hooks

```typescript
// ✅ Đúng
useAuth.ts
useLocalStorage.ts
useStudentQuery.ts

// ❌ Sai
UseAuth.ts
use_local_storage.ts
use - student - query.ts
```

### Services

```typescript
// ✅ Đúng
auth.service.ts
student.api.ts
user.types.ts

// ❌ Sai
authService.ts
studentApi.ts
userTypes.ts
```

### Constants

```typescript
// ✅ Đúng
export const API_BASE_URL = "..."
export const MAX_RETRY_COUNT = 3

// ❌ Sai
export const apiBaseUrl = "..."
export const maxRetryCount = 3
```
