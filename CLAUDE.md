# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A TypeScript library for calculating Japanese standard regional mesh codes (地域メッシュ). Converts between latitude/longitude coordinates and hierarchical mesh codes at three scales (first/second/third division).

## Development Commands

```bash
# Build
npm run build          # Compile TypeScript to lib/

# Testing
npm test              # Run all tests with coverage
vitest run <test-file> # Run specific test file
npm run test:watch    # Run tests in watch mode

# Code Quality
npm run format        # Format code with Biome
npm run lint          # Lint code with Biome
npm run check         # Run Biome format + lint checks
npm run typecheck     # Type check without emitting files

# Prepare
npm run prepare       # Runs build (automatically called on install)
```

## Architecture

### Mesh Hierarchy

The library implements a three-level hierarchical mesh system:

1. **First Mesh (4 digits)**: ~80km × 80km grid - handled by `firstMeshCalculator.ts`
2. **Second Mesh (6 digits)**: First mesh subdivided into 8×8 grid - handled by `secondMeshCalculator.ts`
3. **Third Mesh (8 digits)**: Second mesh subdivided into 10×10 grid - handled by `thirdMeshCalculator.ts`

### Core Components

- **meshCalculator.ts**: Main entry point that delegates to appropriate scale calculator based on mesh code length (4/6/8 digits). Exports `toMeshCode()`, `toCenterLatLng()`, `toBounds()`, `offset()`, and `scaleFrom()`.

- **Scale Calculators** (`firstMeshCalculator.ts`, `secondMeshCalculator.ts`, `thirdMeshCalculator.ts`): Each implements four operations:
  - `toMeshCode(lat, lng)`: Convert coordinates to mesh code
  - `toCenterLatLng(meshCode)`: Get center point of mesh
  - `toBounds(meshCode)`: Get bounds (leftTop, rightBottom) of mesh
  - `offset(meshCode, x, y)`: Calculate adjacent mesh by offset

- **pointCalculator.ts**: Handles digit overflow/underflow when offsetting mesh codes across hierarchy levels. Uses `calcNextPoints()` and `calcPrevPoints()` with Point objects that track `value` and `maxDigit`.

- **constants.ts**: Defines max digit values for each mesh level:
  - FIRST_MAX_DIGIT: 99
  - SECOND_MAX_DIGIT: 7
  - THIRD_MAX_DIGIT: 9

### Key Design Patterns

- Mesh codes can include hyphens (e.g., "5339-45-67") which are stripped before processing
- Second division digits must be 0-7 (validated in second/third mesh calculators)
- Coordinate calculations use fractional math specific to Japanese mesh system (lat × 1.5, lng - 100)
- Offset operations propagate carries/borrows through hierarchy levels using Point arrays

## Code Standards

- Uses Biome for formatting/linting (configured in biome.json)
- Strict TypeScript mode enabled
- Vitest with v8 coverage provider for testing
- Property-based testing with fast-check for edge case validation
- All mesh code inputs validated with regex patterns
- Descriptive error messages include actual vs expected values
