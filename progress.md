# Project: Conxian UI Test Fixes

## 1. Overview

This document tracks the progress of fixing the failing tests in the Conxian UI project.

## 2. Plan

1.  **Fix API Service Tests:**
    *   Refactor `src/lib/api-services.ts` to handle asynchronous loading of `ContractInteractions` in the test environment. This will be done using a proxy to avoid the race condition that is causing the tests to fail.

2.  **Fix UI Tests:**
    *   Update the failing UI tests in `src/tests/ui.test.tsx` to look for the correct button text, "Install Wallet" instead of "Connect Wallet".

3.  **Run Tests:**
    *   Run all tests to confirm that the fixes have been implemented correctly and that all tests pass.

## 3. Progress

*   [x] Fix API Service Tests
*   [x] Fix UI Tests
*   [ ] Run Tests
