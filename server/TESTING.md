# Testing Guide

## Installation

Before running tests, install the required dependencies:

```bash
cd server
npm install
```

This will install:
- `vitest` - Fast unit test framework
- `fast-check` - Property-based testing library
- `@vitest/ui` - Visual test UI

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Property-Based Tests

Property-based tests are located in `tests/properties/` and use fast-check to generate random test cases.

Each property test runs 100 iterations by default with randomly generated inputs to verify that properties hold across all valid inputs.

### Authentication Properties

- **Property 1: Password hashing on registration** - Verifies that passwords are hashed using bcrypt and not stored as plaintext
- **Property 2: JWT token generation on login** - Verifies that JWT tokens contain required user information and are properly signed

## Test Structure

```
server/
├── tests/
│   ├── properties/          # Property-based tests
│   │   └── auth.property.test.js
│   └── unit/                # Unit tests (to be added)
├── vitest.config.js         # Vitest configuration
└── package.json             # Test scripts
```
