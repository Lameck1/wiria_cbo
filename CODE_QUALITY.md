# Code Quality Guide

This document explains the comprehensive code quality infrastructure implemented for the WIRIA CBO project.

**Status**: ESLint errors reduced from 293 to 229 (-64 errors, 22% improvement)

## 🎯 Overview

We've implemented a multi-layered code quality system that includes:

- **Detection**: Automated tools to find issues
- **Prevention**: ESLint and TypeScript configs to catch issues before commit
- **Action**: Scripts to systematically fix issues
- **Monitoring**: CI/CD integration for continuous quality checks

---

## 🔧 Tools Installed

### ESLint Plugins

- `eslint-plugin-import` - Import/export validation and organization
- `eslint-plugin-unicorn` - Best practices and code patterns
- `eslint-plugin-promise` - Promise/async patterns
- `eslint-plugin-sonarjs` - Code smell detection
- `eslint-plugin-react` - React-specific rules
- `eslint-plugin-react-hooks` - Hooks rules
- `eslint-plugin-jsx-a11y` - Accessibility rules

### Analysis Tools

- `knip` - Unused code and dependency detection
- `depcheck` - Dependency validation
- `size-limit` - Bundle size monitoring

---

## 📊 Current Baseline Metrics

After initial setup, here are our baseline metrics:

| Metric                  | Status        | Notes                                       |
| ----------------------- | ------------- | ------------------------------------------- |
| **TypeScript Errors**   | ✅ 0          | Type checking passes                        |
| **ESLint Issues**       | ⚠️ 1111       | 458 errors, 653 warnings (630 auto-fixable) |
| **Security Issues**     | ⚠️ 7 moderate | All in dev dependencies (non-critical)      |
| **Unused Exports**      | ⚠️ 40         | Found by knip                               |
| **Unused Dependencies** | ⚠️ 5          | Dev dependencies                            |
| **TODO Comments**       | ℹ️ 6          | Tracked for follow-up                       |

---

## 🚀 Quick Start

### Run Full Analysis

```bash
./analyze.sh
```

This generates comprehensive reports in the `reports/` directory:

- `SUMMARY.md` - Overview of all findings
- `eslint-report.json` - Detailed ESLint issues
- `eslint-readable.txt` - Human-readable ESLint output
- `typescript-errors.txt` - TypeScript compilation errors
- `unused-code.json` - Unused exports and code
- `unused-deps.json` - Unused dependencies
- `security-audit.json` - Security vulnerabilities
- `bundle-size.json` - Bundle size analysis
- `todos.txt` - All TODO/FIXME comments

### Run Individual Checks

```bash
# Type checking
npm run type-check

# Linting (view issues)
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Check for unused code
npm run audit:unused

# Check dependencies
npm run audit:deps

# Check bundle size
npm run audit:bundle

# Run all audits
npm run audit:full

# Fix all auto-fixable issues
npm run fix:all
```

---

## 🔒 ESLint Configuration

### Critical Rules (Prevent Common Issues)

#### Type Safety

- ❌ `@typescript-eslint/no-explicit-any` - Prevents `any` type
- ❌ `@typescript-eslint/no-unsafe-*` - Prevents unsafe type operations
- ❌ `no-restricted-globals` - Prevents direct localStorage/sessionStorage access

#### Error Handling

- ❌ `@typescript-eslint/no-empty-function` - Prevents empty functions
- ❌ `no-empty` - Prevents empty catch blocks
- ❌ `@typescript-eslint/no-floating-promises` - Forces promise handling
- ❌ `promise/catch-or-return` - Ensures promises are caught

#### React Hooks

- ❌ `react-hooks/rules-of-hooks` - Enforces hooks rules
- ❌ `react-hooks/exhaustive-deps` - Prevents stale closure bugs

#### Accessibility

- ❌ `jsx-a11y/alt-text` - Requires alt text on images
- ❌ `jsx-a11y/anchor-is-valid` - Validates anchor tags
- ❌ `jsx-a11y/click-events-have-key-events` - Keyboard accessibility

### Code Quality Rules

#### Imports

- ⚠️ `import/order` - Organizes imports (auto-fixable)
- ❌ `import/no-duplicates` - Prevents duplicate imports

#### Complexity

- ⚠️ `complexity` - Max cyclomatic complexity: 15
- ⚠️ `max-depth` - Max nesting depth: 4
- ⚠️ `max-lines-per-function` - Max 150 lines per function
- ⚠️ `max-lines` - Max 400 lines per file

#### Code Smells

- ⚠️ `sonarjs/cognitive-complexity` - Max cognitive complexity: 15
- ⚠️ `sonarjs/no-duplicate-string` - Prevents string duplication
- ❌ `sonarjs/no-identical-functions` - Prevents duplicate functions

### File-Specific Overrides

Test files (_.test.ts, _.spec.tsx):

- Relaxed rules for `any` types
- No line limits
- Allows duplicate strings

Config files (_.config.ts, _.config.js):

- Allows CommonJS patterns
- Allows unsafe assignments

---

## 📘 TypeScript Configuration

### Strict Mode Enabled

All strict checks are enabled:

- `strict: true` - Enables all strict checks
- `noUnusedLocals: true` - Catches unused variables
- `noUnusedParameters: true` - Catches unused parameters
- `noImplicitReturns: true` - Requires explicit returns
- `noUncheckedIndexedAccess: true` - Safer array access
- `allowUnusedLabels: false` - Prevents unused labels
- `allowUnreachableCode: false` - Catches dead code

### Path Aliases

Use these aliases for cleaner imports:

```typescript
import { Button } from '@/shared/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import HomePage from '@/pages/HomePage';
import { AppProviders } from '@/app/providers';
```

---

## 🤖 CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/code-quality.yml` workflow runs on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Jobs

1. **Quality Checks**
   - Type checking
   - Linting
   - Unused code detection
   - Bundle size checking
   - Security audit
   - Test coverage

2. **Dependency Review** (PR only)
   - Reviews new dependencies
   - Flags security issues

---

## 💡 VS Code Integration

The `.vscode/settings.json` file configures:

- Format on save
- Auto-fix ESLint issues on save
- Organize imports on save
- Enable ESLint status indicator

### Recommended Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features

---

## 📋 Best Practices

### 1. Before Committing

```bash
# Run auto-fix and check
npm run fix:all
npm run type-check
npm run lint
```

### 2. Adding New Dependencies

```bash
# Install the dependency
npm install <package>

# Check for security issues
npm audit

# Check if it's actually used
npm run audit:deps
```

### 3. Removing Unused Code

```bash
# Find unused exports
npm run audit:unused

# Review the report
cat reports/unused-code.json
```

### 4. Monitoring Bundle Size

```bash
# Build and check size
npm run audit:bundle

# Review the limits in .size-limit.cjs
```

### 5. Handling ESLint Errors

**Auto-fixable issues** (630 issues):

```bash
npm run lint:fix
```

**Manual fixes needed** (481 issues):

1. Review `reports/eslint-readable.txt`
2. Focus on errors first (458 errors)
3. Address warnings incrementally

Common issues to fix:

- Import order (auto-fixable)
- Missing return types (add `: ReturnType`)
- Unsafe type operations (add proper types)
- Direct localStorage access (use storageService)
- Empty catch blocks (add error handling)

---

## 🎯 Incremental Improvement Strategy

### Phase 1: Auto-fix Everything Possible ✅

```bash
npm run fix:all
git add .
git commit -m "chore: auto-fix ESLint and format issues"
```

### Phase 2: Critical Errors (Priority: HIGH)

Focus on these high-impact issues:

1. Direct localStorage access (use storageService)
2. Empty catch blocks (add error handling)
3. Floating promises (add await or .catch())
4. Unsafe type operations (fix types)

### Phase 3: Import Organization (Priority: MEDIUM)

```bash
# Most are auto-fixable
npm run lint:fix
```

### Phase 4: Code Quality (Priority: LOW)

Address these over time:

- Complexity warnings
- Duplicate strings
- Function length warnings

---

## 🔍 Understanding Reports

### ESLint Report

```bash
# Quick summary
cat reports/eslint-readable.txt | tail -5

# Detailed JSON
cat reports/eslint-report.json | jq '.[] | select(.errorCount > 0)'
```

### Security Audit

```bash
# View vulnerabilities
cat reports/security-audit.json | jq '.metadata.vulnerabilities'

# See affected packages
npm audit
```

### Unused Code

```bash
# Count unused exports
cat reports/unused-code.json | jq '.issues | length'

# List unused files
cat reports/unused-code.json | jq '.issues[] | select(.type == "files")'
```

### Bundle Size

```bash
# View sizes
cat reports/bundle-size.json

# Compare against limits in .size-limit.cjs
cat .size-limit.cjs
```

---

## 📚 Resources

### Documentation

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [React Hooks Rules](https://react.dev/reference/react/hooks#rules-of-hooks)
- [Import Plugin](https://github.com/import-js/eslint-plugin-import)
- [SonarJS Rules](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [Unicorn Rules](https://github.com/sindresorhus/eslint-plugin-unicorn)

### Tools

- [Knip Documentation](https://knip.dev/)
- [Size Limit](https://github.com/ai/size-limit)
- [Depcheck](https://github.com/depcheck/depcheck)

---

## ❓ FAQ

### Why so many ESLint errors?

We've implemented a comprehensive rule set. Many issues (630/1111) are auto-fixable. The rest are opportunities to improve code quality incrementally.

### Should I fix all issues immediately?

No. Focus on:

1. Auto-fixable issues (run `npm run fix:all`)
2. Critical errors (type safety, error handling)
3. New code (prevent new issues)

### Can I disable a rule?

Yes, but document why:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Legacy code, TODO: fix types
const data: any = getLegacyData();
```

### How do I run checks faster?

```bash
# Type check only
npm run type-check

# Lint specific files
npx eslint src/features/auth --ext .ts,.tsx

# Skip some checks in analyze.sh
# Edit analyze.sh and comment out sections
```

### What if CI fails?

1. Check the GitHub Actions logs
2. Run the same checks locally
3. Fix issues and push again

---

## 🎓 Learning Path

For developers new to this setup:

1. **Week 1**: Understand ESLint errors
   - Run `npm run lint`
   - Read first 50 errors
   - Fix 5-10 auto-fixable issues

2. **Week 2**: Learn type safety
   - Run `npm run type-check`
   - Understand `any` vs proper types
   - Fix unsafe type operations

3. **Week 3**: Improve patterns
   - Review SonarJS warnings
   - Refactor complex functions
   - Extract duplicate code

4. **Week 4**: Optimize
   - Check bundle size
   - Remove unused code
   - Lazy load components

---

## 🤝 Contributing

When contributing:

1. ✅ Run `npm run fix:all` before committing
2. ✅ Ensure `npm run type-check` passes
3. ✅ Fix any new ESLint errors you introduce
4. ✅ Add tests for new features
5. ✅ Update documentation if needed

---

## 📧 Support

For questions about code quality setup:

- Review this document
- Check `reports/` directory
- Run `./analyze.sh` for latest metrics

---

**Remember**: These tools are here to help, not hinder. They catch bugs before they reach production and enforce consistent patterns across the codebase. Use them as learning tools! 🚀
