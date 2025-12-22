# Conxian UI/Contract Alignment Plan

## 1. Executive Summary

This document outlines the strategy to align the Conxian UI (`Conxian_UI`) with the deployed Conxian smart contracts (`Conxian` repo). Currently, there are discrepancies in contract interfaces (Router vs DEX Factory), function signatures, and styling.

## 2. Visual Alignment

**Goal:** Ensure consistency with the official StacksOrbit/Conxian brand palette.

- [x] **Tailwind Configuration:** Updated `tailwind.config.ts` to include `primary-dark`, `text-primary`, `text-secondary`, and `background-paper` to match design system tokens.
- [ ] **Component Review:**
  - **Card:** Verify `Card`, `CardHeader`, `CardTitle` utilize the new color tokens.
  - **Buttons:** Ensure hover states use `primary-dark`.
  - **Inputs:** Check borders and focus states for `accent` color usage.

## 3. Contract Integration Alignment

**Goal:** Replace mock/legacy calls with live contract interactions.

- [x] **Self-Launch Service:** Updated `SelfLaunchContract` class to use `STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.self-launch-coordinator`.
- [x] **Swap Estimation:** Refactored `src/app/swap/page.tsx` to use `dex-factory-v2` for pool discovery and `get-quote` for pricing, replacing the obsolete `multi-hop-router` estimation.
- [ ] **Liquidity Pages:**
  - Audit `src/app/add-liquidity/page.tsx` (if exists) or equivalent.
  - Ensure it uses `dex-factory-v2.create-pool` or `concentrated-liquidity-pool.add-liquidity`.
- [ ] **Token List:** Validate `src/lib/contracts.ts` token list against deployed tokens on Testnet.

## 4. Testing Strategy

**Goal:** Verify system stability and correctness.

### 4.1. Unit Testing (Backend)

- Run `clarinet test` in `Conxian` repo to verify contract logic independent of UI.
- Focus on `dex-factory-v2` and `concentrated-liquidity-pool` interactions.

### 4.2. E2E Testing (Frontend)

- **Framework:** Playwright (already installed).
- **Environment:** Run against `stacks-node` devnet or mocked API responses.
- **Critical Paths to Test:**
    1. **Wallet Connection:** Mock successful connection.
    2. **Token Swap:**
        - Select Token A -> Token B.
        - Enter Amount.
        - Verify "Getting estimate..." triggers and resolves (mock response).
        - Verify "Swap" button enables.
    3. **Self-Launch:**
        - View Launch Status (mocked read-only).
        - Verify "Contribute" flow initiates transaction signing.

## 5. Next Steps

1. **Manual Verification:** Developer to run the app locally (`npm run dev`) and test the Swap flow with a Testnet wallet.
2. **Liquidity Feature:** Implement/Update the "Add Liquidity" UI to match the Concentrated Liquidity Pool interface (tick ranges, etc.).
3. **Deployment:** Build and deploy the updated UI to Vercel/Netlify.
