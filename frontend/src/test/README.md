# Test Suite

This directory contains test utilities and setup files for the frontend application.

## Test Setup

- **Vitest**: Test runner configured in `vite.config.ts`
- **React Testing Library**: For component testing
- **jsdom**: DOM environment for tests

## Test Files

### Redux Slice Tests
- `store/slices/uiSlice.test.ts` - Tests for UI state management
- `store/slices/gameSlice.test.ts` - Tests for game state management
- `store/slices/authSlice.test.ts` - Tests for authentication state management
- `store/index.test.ts` - Tests for store configuration

### Service Tests
- `services/api.test.ts` - Tests for API service

### Utility Tests
- `lib/queryKeys.test.ts` - Tests for query key factory

## Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test --run

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Utilities

The `test/utils.tsx` file provides helper functions for testing:
- `renderWithProviders`: Renders components with Redux store and TanStack Query providers

## Writing New Tests

When writing new tests:

1. Use the `renderWithProviders` utility for components that use Redux or TanStack Query
2. Mock external dependencies (API calls, WebSocket, etc.)
3. Test user interactions, not implementation details
4. Keep tests focused and independent

