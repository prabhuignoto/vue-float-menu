# TypeScript Configuration

This project uses a modern TypeScript configuration optimized for Vue 3 development.

## Key Features

### Modern TypeScript Standards

- **Target**: ES2022 for modern JavaScript features
- **Module**: ESNext with bundler resolution for optimal tree-shaking
- **Strict Type Checking**: Enhanced type safety with configurable strictness

### Vue 3 Optimizations

- Full Vue 3 Single File Component (SFC) support
- JSX support with Vue 3 JSX transformer
- Proper type definitions for `.vue` files
- Asset type declarations (images, SVGs, etc.)

### Development Experience

- **Type Checking**: `pnpm type-check` for full type validation
- **Watch Mode**: `pnpm type-check:watch` for real-time type checking
- **Build Types**: Separate build configuration for library distribution
- **Source Maps**: Full source map support for debugging

### Configuration Files

- `tsconfig.json` - Main TypeScript configuration for development
- `tsconfig.build.json` - Optimized configuration for library builds
- `tsconfig.eslint.json` - ESLint-specific TypeScript configuration
- `src/shims-vue.d.ts` - Vue and asset type declarations

### Performance Optimizations

- **Incremental Compilation**: Faster rebuilds with build info caching
- **Skip Lib Check**: Faster compilation by skipping type checking of declaration files
- **Module Detection**: Automatic module detection for better compatibility
- **Verbatim Module Syntax**: Optimized for bundlers

### Scripts

```bash
# Type checking
pnpm type-check          # Check types without emitting files
pnpm type-check:watch    # Watch mode type checking

# Building
pnpm build:lib          # Build library with type checking
pnpm build              # Standard Vite build

# Linting (includes type checking)
pnpm lint:all           # Run all lints including type check
```

## Compatibility

- **Vue**: 3.0.4+
- **TypeScript**: 5.8+
- **Node.js**: 16+
- **Bundlers**: Vite, Rollup, Webpack 5+
