# Conxian UI Analysis Report

## 1. Introduction

This report analyzes the Conxian UI frontend to understand its architecture and how it interacts with its backend. Since the backend repository is not directly accessible, this analysis is based on the frontend codebase.

## 2. Architecture Overview

The Conxian UI is a Next.js-based web application. It does not have a traditional backend server. Instead, it interacts directly with the Conxian smart contracts deployed on the Stacks blockchain. This makes it a decentralized application (dApp).

## 3. Backend Interaction

The "backend" for this application is the set of Conxian smart contracts on the Stacks blockchain. The frontend communicates with the blockchain via the Hiro API, as configured in `src/lib/coreApi.ts` and `src/lib/contract-interactions.ts`.

### Key Files for Backend Interaction:

*   **`src/lib/contracts.ts`**: This file defines the addresses and metadata of the core Conxian smart contracts. It lists various tokens, DEX-related contracts, oracles, and other components of the Conxian ecosystem. All contract identifiers are derived from a base principal, which makes the deployment environment configurable.

*   **`src/lib/coreApi.ts`**: This file contains low-level functions for making API calls to the Stacks blockchain. It includes functions for:
    *   Fetching network status (`getStatus`).
    *   Retrieving address balances (`getAddressBalances`, `getFungibleTokenBalances`).
    *   Making read-only contract calls (`callReadOnly`).

*   **`src/lib/contract-interactions.ts`**: This file provides a higher-level abstraction for interacting with the smart contracts. It uses the `@stacks/transactions` and `@stacks/connect` libraries to build and send transactions. Key functions include:
    *   `callReadOnlyContractFunction`: For querying data from smart contracts without submitting a transaction to the blockchain.
    *   `callPublicContractFunction`: For executing transactions that modify the state of the blockchain (e.g., making a swap or creating a liquidity pool pair). This function uses `@stacks/connect` to prompt the user to sign the transaction with their wallet.

## 4. Data Flow

The data flow is typical for a dApp:

1.  **UI Components**: The user interacts with UI components in the `src/components` and `src/app` directories.
2.  **Contract Interactions**: When a user performs an action (e.g., clicking a "swap" button), the UI calls a function from `src/lib/contract-interactions.ts`.
3.  **Blockchain Communication**:
    *   For read-only operations, `callReadOnlyContractFunction` uses `fetchCallReadOnlyFunction` from `@stacks/transactions`, which in turn queries a Stacks node (via the URL in `AppConfig.coreApiUrl`).
    *   For transactions, `callPublicContractFunction` uses `openContractCall` from `@stacks/connect` to open a wallet popup for the user to approve the transaction.
4.  **State Update**: The UI updates its state based on the result of the blockchain interaction.

## 5. Potential Misalignments

Based on the analysis, the following potential misalignments have been identified:

*   **Deprecated `@stacks/connect` Usage**: The file `src/lib/contract-interactions.ts` uses the `openContractCall` function from `@stacks/connect`. According to the official documentation, this function is deprecated in version 8.x.x and should be replaced with the new `request` method. The project is currently using version 8.1.9 of `@stacks/connect`. This is a clear indication that the frontend is not aligned with the latest library updates, which could lead to unexpected behavior or a broken user experience.

## 6. Proposed Alignment Strategy

To align the frontend with the backend and ensure long-term stability, I propose the following changes:

1.  **Update `src/lib/contract-interactions.ts`**:
    *   Replace the deprecated `openContractCall` function with the new `request("stx_callContract", ...)` method from `@stacks/connect`.
    *   Update the `callPublicContractFunction` to use the new `request` method. This will involve changing the function signature to be asynchronous and replacing the `onFinish` and `onCancel` callbacks with `async/await` or `.then()/.catch()` promise handling.
    *   Remove the `AppConfig as ConnectAppConfig` import, as it is no longer needed with the new `request` method.
