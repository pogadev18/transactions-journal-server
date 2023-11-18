# Stock Transaction Journal API

## Overview

This project is a simple API for a Stock Transaction Journal, built using Node.js, Express, and TypeScript. It allows users to log stock transactions with a date, title, and detailed notes.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- pnpm / npm (Node Package Manager) - we use `pnpm` for this API

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory.
3. Install the required dependencies:

   ```bash
   pnpm install
   ```

## Scripts in `package.json`

The following scripts are available in the `package.json` file to facilitate development and testing:

- `start`: Runs the compiled server. Use this for production or testing the compiled code.

  ```bash
  pnpm start
  ```

- `dev`: Runs the server in development mode using `nodemon` and `ts-node`. It automatically restarts the server on file changes.

  ```bash
  pnpm run dev
  ```

- `build`: Compiles TypeScript code to JavaScript in the `dist` directory.
  ```bash
  pnpm run build
  ```

## Building the Project

To compile TypeScript code to JavaScript, use the build script:

```bash
pnpm run build
```
