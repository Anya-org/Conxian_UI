# Conxian UI: Improvement Proposals

This document outlines a series of proposals for improving the Conxian UI application, focusing on decentralization, UI/UX, and functionality.

## 1. Decentralization

### 1.1. Decentralized Hosting

*   **Proposal:** Host the application on a decentralized storage network like IPFS or Arweave.
*   **Implementation Steps:**
    1.  Configure the Next.js application for static export (`next build && next export`).
    2.  Inject a dynamic `<base>` tag to handle IPFS gateway URLs.
    3.  Set `assetPrefix: './'` in `next.config.js`.
    4.  Use `exportTrailingSlash: true` for clean URLs.
    5.  Create a custom `Link` component to handle IPFS routing.
*   **Cost Analysis:**
    *   IPFS hosting is free for public data.
    *   Pinning services (e.g., Pinata, Fleek) offer free tiers and paid plans based on storage and bandwidth usage. A typical free tier would be sufficient for this application.

### 1.2. Decentralized Domain

*   **Proposal:** Use a Handshake domain to provide a censorship-resistant and user-owned domain for the application.
*   **Implementation Steps:**
    1.  Acquire a Handshake domain through a registrar like Namecheap or Namebase.
    2.  Configure a `TXT` record with a `dnslink` value pointing to the IPFS hash of the deployed application.
*   **Cost Analysis:**
    *   Handshake domain prices vary depending on the TLD and registrar. Prices typically range from $10 to $50 per year.

### 1.3. User-Configurable RPC Endpoint

*   **Proposal:** Allow users to configure their own custom Stacks API URL.
*   **Implementation Steps:**
    1.  Add a settings icon to the navbar that opens a modal for entering a custom URL.
    2.  Use `localStorage` to persist the custom URL.
    3.  Modify the `getCoreApiUrl` function to prioritize the user-configured URL.
*   **Development Effort:** 4-6 hours.

## 2. UI/UX and Functionality

### 2.1. Interactive and Personalized Dashboard

*   **Proposal:** Create a personalized dashboard that displays the user's portfolio, including token balances, staking positions, and liquidity pool shares.
*   **Implementation Steps:**
    1.  Integrate with the user's wallet to fetch their portfolio data.
    2.  Create UI components for the portfolio overview, token balances, staking positions, and liquidity pool shares.
    3.  Implement logic for calculating P&L and APY.
*   **Development Effort:** 12-16 hours.

### 2.2. User Onboarding and Guidance

*   **Proposal:** Implement a guided tour, tooltips, and an FAQ section to improve user onboarding and guidance.
*   **Implementation Steps:**
    1.  Create the content for the guided tour, tooltips, and FAQ section.
    2.  Implement the UI components for the guided tour and tooltips.
    3.  Create the FAQ page.
*   **Development Effort:** 8-12 hours.
