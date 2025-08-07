# Test Structure

This project has a structured test setup that allows running different types of tests separately.

## Test Organization

### Unit Tests
- **Location**: `src/services/__tests__/`
- **Purpose**: Test individual service methods in isolation
- **Files**:
  - `AuthService.test.ts`
  - `CommentService.test.ts`
  - `FeedbackService.test.ts`
  - `UserService.test.ts`

### E2E Tests
- **Location**: `src/__tests__/e2e/`
- **Purpose**: Test complete API endpoints and workflows
- **Files**:
  - `auth.test.ts`
  - `comment.test.ts`
  - `feedback.test.ts`

## Available Commands

### Run All Tests
```bash
npm test
```

### Run Unit Tests Only
```bash
npm run test:unit
```

### Run E2E Tests Only
```bash
npm run test:e2e
```

### Watch Mode
```bash
# Watch all tests
npm run test:watch

# Watch unit tests only
npm run test:watch:unit

# Watch e2e tests only
npm run test:watch:e2e
```

## Configuration Files

- `jest.config.js` - Base configuration with `testMatch: ['**/*.test.ts']`
- `jest.unit.config.js` - Unit test configuration targeting `**/services/__tests__/**/*.test.ts`
- `jest.e2e.config.js` - E2E test configuration targeting `**/__tests__/e2e/**/*.test.ts`

## Test Setup

- Unit tests run in isolation with mocked dependencies
- E2E tests use a test database and require database setup via `src/__tests__/utils/db.ts`
- E2E tests have a longer timeout (30s) compared to unit tests (10s)
- Only files ending with `.test.ts` are treated as test files 