#!/bin/bash
# analyze.sh - Run complete codebase analysis

echo "🔍 Starting comprehensive code analysis..."

# Create reports directory
mkdir -p reports

# 1. TypeScript compilation
echo "📘 Type checking..."
npx tsc --noEmit --pretty > reports/typescript-errors.txt 2>&1 || true

# 2. ESLint analysis
echo "🔧 Running ESLint..."
npx eslint src --ext .ts,.tsx --format json --output-file reports/eslint-report.json || true
npx eslint src --ext .ts,.tsx --format stylish > reports/eslint-readable.txt || true

# 3. Find unused exports
echo "🧹 Finding unused code..."
npx knip --reporter json > reports/unused-code.json || true

# 4. Check for unused dependencies
echo "📦 Checking dependencies..."
npx depcheck --json > reports/unused-deps.json || true

# 5. Security audit
echo "🔒 Security audit..."
npm audit --json > reports/security-audit.json || true

# 6. Bundle analysis
echo "📊 Analyzing bundle size..."
npm run build -- --mode=analysis > reports/build-output.txt 2>&1 || true
npx size-limit --json > reports/bundle-size.json || true

# 7. Test coverage
echo "🧪 Running tests with coverage..."
npm run test:coverage -- --reporter=json > reports/test-results.json 2>&1 || true

# 8. Find TODO comments
echo "📝 Finding TODOs..."
grep -r "TODO\|FIXME\|HACK\|XXX" src --exclude-dir=node_modules > reports/todos.txt 2>/dev/null || true

# 9. Count code statistics
echo "📈 Calculating metrics..."
if command -v cloc &> /dev/null; then
  npx cloc src --json > reports/code-stats.json || true
else
  echo "cloc not installed, skipping code statistics" > reports/code-stats.json
fi

# 10. Generate summary
echo "📄 Generating summary..."
cat > reports/SUMMARY.md << 'EOF'
# Code Analysis Summary
Generated: $(date)

## TypeScript Errors
```
$(wc -l < reports/typescript-errors.txt) lines of output
```

## ESLint Issues
Check reports/eslint-readable.txt for details

## Unused Code
Check reports/unused-code.json for details

## Security Vulnerabilities
Check reports/security-audit.json for details

## Bundle Size
Check reports/bundle-size.json for details

## Test Coverage
Check coverage/coverage-summary.json for details (if available)

## TODO Items
```
$(wc -l < reports/todos.txt 2>/dev/null || echo 0) TODOs found
```

## Code Statistics
Check reports/code-stats.json for details

---
View detailed reports in ./reports/ directory
EOF

echo "✅ Analysis complete! Check reports/SUMMARY.md"
