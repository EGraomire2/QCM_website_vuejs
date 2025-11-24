# Contributing to SOSprépa

Thank you for your interest in contributing to SOSprépa! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Trolling or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v5.7 or higher)
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/QCM_website_vuejs.git
cd QCM_website_vuejs
```

3. **Add upstream remote**:
```bash
git remote add upstream https://github.com/EGraomire2/QCM_website_vuejs.git
```

4. **Install dependencies**:
```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

5. **Set up database**:
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE sos_prepa_bdd;"

# Import schema
mysql -u root -p sos_prepa_bdd < former_project/sosprepa_creation.sql

# Import sample data (optional)
mysql -u root -p sos_prepa_bdd < former_project/sosprepa_JeuxDonnées.sql
```

6. **Configure environment variables**:
```bash
# Server
cd server
cp .env.example .env
# Edit .env with your configuration

# Client
cd ../client
cp .env.example .env
# Edit .env with your configuration
```

7. **Run tests** to verify setup:
```bash
# Backend tests
cd server
npm test

# Frontend tests (if available)
cd ../client
npm test
```

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
- `feature/add-user-profile`
- `fix/login-validation-error`
- `docs/update-api-documentation`

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add tests for new features
- Update documentation as needed
- Keep commits focused and atomic

### 3. Test Your Changes

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# Manual testing
npm run dev  # From root directory
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add user profile page"
```

See [Commit Messages](#commit-messages) for guidelines.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit the pull request

## Coding Standards

### JavaScript/Vue.js Style Guide

We follow the [Vue.js Style Guide](https://vuejs.org/style-guide/) and [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).

#### General Rules

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use camelCase for variables and functions
- Use PascalCase for components and classes
- Use UPPER_CASE for constants

#### Vue.js Specific

```vue
<!-- Good -->
<template>
  <div class="user-profile">
    <h1>{{ userName }}</h1>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  props: {
    userName: {
      type: String,
      required: true
    }
  },
  methods: {
    handleClick() {
      // Handle click
    }
  }
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
}
</style>
```

#### Node.js/Express Specific

```javascript
// Good
const express = require('express');
const router = express.Router();

router.get('/users/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

### Code Organization

- Keep files focused and single-purpose
- Extract reusable logic into services/utilities
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Error Handling

```javascript
// Backend - Always use try-catch with next()
router.post('/endpoint', async (req, res, next) => {
  try {
    // Your code
  } catch (error) {
    next(error);
  }
});

// Frontend - Handle API errors gracefully
try {
  const response = await api.post('/endpoint', data);
  // Handle success
} catch (error) {
  // Show user-friendly error message
  notificationStore.showError(error.response?.data?.message || 'An error occurred');
}
```

## Testing Guidelines

### Backend Tests

#### Unit Tests

Test individual functions and services:

```javascript
// tests/unit/scoring.test.js
import { describe, it, expect } from 'vitest';
import { calculateScore } from '../services/scoring.js';

describe('Scoring Service', () => {
  it('should award full points for correct answer', () => {
    const question = {
      type: 'unique',
      points: 5,
      negativePoints: 2,
      propositions: [
        { id: 1, validity: true },
        { id: 2, validity: false }
      ]
    };
    
    const score = calculateScore(question, [1]);
    expect(score).toBe(5);
  });
});
```

#### Integration Tests

Test API endpoints:

```javascript
// tests/integration/auth.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('Authentication', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

#### Property-Based Tests

Test properties across random inputs:

```javascript
// tests/properties/auth.property.test.js
import fc from 'fast-check';
import { hashPassword } from '../services/auth.js';

describe('Authentication Properties', () => {
  it('should never store plaintext passwords', () => {
    fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 8 }),
        async (password) => {
          const hash = await hashPassword(password);
          expect(hash).not.toBe(password);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Frontend Tests

```javascript
// tests/components/LoginView.spec.js
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginView from '@/views/LoginView.vue';

describe('LoginView', () => {
  it('should render login form', () => {
    const wrapper = mount(LoginView);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Focus on critical paths and edge cases
- Don't test implementation details
- Test behavior, not implementation

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(qcm): correct scoring calculation for multiple choice"

# Documentation
git commit -m "docs(api): update authentication endpoints documentation"

# Breaking change
git commit -m "feat(api): change response format

BREAKING CHANGE: API responses now include a 'data' wrapper"
```

### Guidelines

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject line with a period
- Separate subject from body with a blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

## Pull Request Process

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with main

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. **Automated checks** must pass (tests, linting)
2. **Code review** by at least one maintainer
3. **Changes requested** - address feedback and update PR
4. **Approval** - PR is approved by maintainer
5. **Merge** - Maintainer merges the PR

### After Merge

- Delete your feature branch
- Update your local main branch
- Close related issues

## Reporting Bugs

### Before Reporting

- Check if the bug has already been reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 20.04]
- Node.js version: [e.g., 14.17.0]
- Browser: [e.g., Chrome 91]

## Screenshots
If applicable

## Additional Context
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this feature address?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## Questions?

If you have questions about contributing:

1. Check the [README.md](README.md)
2. Check existing issues and discussions
3. Open a new issue with the "question" label
4. Contact the maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to SOSprépa! 🎉
