module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true 
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:sonarjs/recommended',
    'prettier' // Must be last
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'node_modules', 'backend'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'import',
    'unicorn',
    'promise',
    'sonarjs'
  ],
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  },
  rules: {
    // ==========================================
    // 🔴 CRITICAL: Catches issues from audit
    // ==========================================
    
    // Prevent console statements in production
    'no-console': ['warn', { 
      allow: ['warn', 'error'] 
    }],
    
    // Prevent direct localStorage access
    'no-restricted-globals': ['error', {
      name: 'localStorage',
      message: 'Use storageService instead of direct localStorage access'
    }, {
      name: 'sessionStorage',
      message: 'Use storageService instead of direct sessionStorage access'
    }],
    
    // Prevent 'any' type
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    
    // Prevent silent error swallowing
    '@typescript-eslint/no-empty-function': 'error',
    'no-empty': ['error', { allowEmptyCatch: false }],
    
    // Force proper error handling
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    'promise/catch-or-return': 'error',
    'promise/always-return': 'error',
    
    // Prevent useEffect issues
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['error', {
      additionalHooks: '(useMemoizedCallback|useAsyncEffect)'
    }],
    
    // ==========================================
    // 🟠 HIGH PRIORITY
    // ==========================================
    
    // Prevent unused variables
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_'
    }],
    
    // Require explicit return types for exported functions
    '@typescript-eslint/explicit-module-boundary-types': ['error', {
      allowArgumentsExplicitlyTypedAsAny: false
    }],
    
    // Prevent magic numbers
    '@typescript-eslint/no-magic-numbers': ['warn', {
      ignore: [0, 1, -1],
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      ignoreReadonlyClassProperties: true
    }],
    
    // Accessibility
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/no-static-element-interactions': 'error',
    
    // Import organization
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external', 
        'internal',
        ['parent', 'sibling'],
        'index',
        'object',
        'type'
      ],
      'pathGroups': [
        {
          pattern: 'react',
          group: 'external',
          position: 'before'
        },
        {
          pattern: '@/**',
          group: 'internal',
          position: 'after'
        }
      ],
      'pathGroupsExcludedImportTypes': ['react'],
      'newlines-between': 'always',
      'alphabetize': {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    'import/no-duplicates': 'error',
    'import/no-unused-modules': 'error',
    
    // ==========================================
    // 🟡 MEDIUM PRIORITY
    // ==========================================
    
    // Code quality
    'sonarjs/cognitive-complexity': ['warn', 15],
    'sonarjs/no-duplicate-string': ['warn', { threshold: 5 }],
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-collapsible-if': 'warn',
    
    // Best practices from unicorn
    'unicorn/filename-case': ['error', {
      cases: {
        camelCase: true,
        pascalCase: true
      }
    }],
    'unicorn/no-null': 'off', // We use null for React
    'unicorn/prevent-abbreviations': ['warn', {
      allowList: {
        props: true,
        Props: true,
        ref: true,
        Ref: true,
        params: true,
        Params: true,
        args: true,
        env: true,
        dev: true,
        prod: true
      }
    }],
    
    // Complexity limits
    'complexity': ['warn', { max: 10 }],
    'max-depth': ['warn', { max: 3 }],
    'max-lines-per-function': ['warn', { 
      max: 100, 
      skipBlankLines: true, 
      skipComments: true 
    }],
    'max-lines': ['warn', { 
      max: 300, 
      skipBlankLines: true, 
      skipComments: true 
    }],
    
    // ==========================================
    // ⚙️ OVERRIDES (Disable problematic rules)
    // ==========================================
    
    'unicorn/no-array-reduce': 'off', // We use reduce
    'unicorn/no-array-for-each': 'off', // forEach is fine
    'react-refresh/only-export-components': ['warn', { 
      allowConstantExport: true 
    }]
  },
  
  // Override rules for specific files
  overrides: [
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-magic-numbers': 'off',
        'sonarjs/no-duplicate-string': 'off'
      }
    },
    {
      files: ['vite.config.ts', '*.config.ts', '*.config.js'],
      rules: {
        'import/no-default-export': 'off'
      }
    }
  ]
};
