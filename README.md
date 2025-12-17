# Welcome to the Conxian UI!

![Conxian UI Homepage](docs/images/homepage.png)

This is the official UI for interacting with Conxian contracts on the Stacks blockchain. Whether you're a casual user or a seasoned pro, we've got you covered.

## Two Modes, One Seamless Experience

We offer two distinct modes to cater to your needs:

*   **Retail Mode**: A simple and intuitive interface for everyday users.
*   **PRO Mode**: A dark-themed, power-packed interface for our more advanced users.

## Our Signature Look: The Conxian Color Palette

Our "earthy corporate finance" theme is designed to be both professional and inviting:

*   **Primary**: #2E403B (a deep, calming green)
*   **Accent**: #D4A017 (a touch of sophisticated gold)
*   **Neutrals**: #F5F5F5, #E0E0E0, #333333 (for a clean, modern look)

## Getting Started

Ready to dive in? Here's how to get up and running:

### Requirements

*   Node.js 20+
*   A Core API URL (Hiro): mainnet/testnet/devnet

### Installation

```bash
npm install
```

### Run (Dev)

```bash
NEXT_PUBLIC_CORE_API_URL=https://api.testnet.hiro.so npm run dev
```

## Our Backend: The Power of the Stacks Blockchain

This frontend is powered by the Conxian DeFi protocol backend contracts. For a full list of our contracts, check out our `ARCHITECTURE.md` file.

## Our Contract Interaction System: A Seamless Experience

Our contract interaction system (`src/lib/contract-interactions.ts`) is designed to be:

*   **User-Friendly**: With read-only and public function calls, you can query contract state and execute transactions with ease.
*   **Type-Safe**: Our TypeScript interfaces ensure that all contract interactions are safe and secure.
*   **Robust**: With comprehensive error handling, you can be sure that your transactions will be handled with care.

## Testing: Our Commitment to Quality

We're committed to providing a high-quality experience. That's why we've implemented a comprehensive test suite that covers:

*   Contract function calls
*   Error handling scenarios
*   Configuration validation
*   Integration with the Stacks network

## Development: A Look Under the Hood

Our development environment is designed to be as user-friendly as our app. With features like our Clarity Argument Builder and dynamic ABI fetching, you can build and test with ease.

## Smoke Tests: A Quick Sanity Check

Want to make sure everything is running smoothly? Our smoke tests are a quick and easy way to check the health of our app.

## We're Here to Help

Whether you're a retail user, a pro, or a developer, we're here to help you make the most of the Conxian UI. If you have any questions, don't hesitate to reach out to our team. Happy swapping!
