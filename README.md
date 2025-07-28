# SnapLife GraphQL Service

This repository contains the SnapLife GraphQL service, an Apollo Server-based application built with Node.js and TypeScript. It acts as an orchestration layer, providing a unified GraphQL API for various backend microservices, including Organization, Company, User, and Authentication services.

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
    * [Configuration](#configuration)
    * [Running Locally](#running-locally)
* [API Endpoints](#api-endpoints)
* [Project Structure](#project-structure)
* [Authentication & Authorization](#authentication--authorization)
* [Error Handling](#error-handling)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

## Features

* **Unified GraphQL Endpoint:** Provides a single, consistent API for all SnapLife client applications.
* **Microservice Orchestration:** Seamlessly integrates with and orchestrates data from multiple backend microservices.
* **Type-Safe Development:** Leverages TypeScript for robust and maintainable code.
* **Apollo Server:** Utilizes the powerful and flexible Apollo Server for GraphQL implementation.
* **Authentication & Authorization:** Integrates with the Authentication Service to secure API access.

## Technologies Used

* **Node.js:** JavaScript runtime environment.
* **TypeScript:** Superset of JavaScript that compiles to plain JavaScript.
* **Apollo Server:** Production-ready, open-source GraphQL server.
* **GraphQL:** Query language for your API.
* **Express.js (or similar):** Web framework for Node.js (often used with Apollo Server).
* **Dotenv:** For managing environment variables.
* **Axios (or similar):** Promise-based HTTP client for making requests to backend microservices.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* Node.js (LTS version recommended)
* npm or Yarn (package manager)
* Access to the following backend microservices:
    * Organization Service API
    * Company Service API
    * User Service API
    * Authentication Service API

### Project Structure
.
├── src/
│   ├── index.ts              # Entry point of the application, sets up Apollo Server
│   ├── graphql/
│   │   ├── schema.ts         # Combines all GraphQL type definitions and resolvers
│   │   ├── typeDefs/         # Directory for GraphQL schema definitions (e.g., .gql files or .ts modules exporting GQL strings)
│   │   │   ├── organization.ts # Defines types and queries/mutations related to organizations
│   │   │   ├── company.ts      # Defines types and queries/mutations related to companies
│   │   │   ├── user.ts         # Defines types and queries/mutations related to users
│   │   │   └── auth.ts         # Defines types and queries/mutations related to authentication
│   │   └── resolvers/        # Directory for GraphQL resolver functions
│   │   |   ├── organizationResolver.ts # Resolvers for organization-related operations
│   │   |   ├── companyResolver.ts      # Resolvers for company-related operations
│   │   |   ├── userResolver.ts         # Resolvers for user-related operations
│   │   |   └── authResolver.ts         # Resolvers for authentication-related operations
|   |   |__ services/
│   |   |   ├── organizationService.ts  # Service for interacting with the Organization API
│   |   |   ├── companyService.ts       # Service for interacting with the Company API
│   |   |   ├── userService.ts          # Service for interacting with the User API
│   |   |   |__ authService.ts          # Service for interacting with the Authentication API
│   ├── datasources/          # Classes/modules for interacting with backend microservices
│   │   ├── organizationAPI.ts  # Handles communication with the Organization Service
│   │   ├── companyAPI.ts       # Handles communication with the Company Service
│   │   ├── userAPI.ts          # Handles communication with the User Service
│   │   └── authAPI.ts # Handles communication with the Authentication Service
│   ├── utils/                # General utility functions (e.g., error formatting, logging, helpers)
│   ├── config/               # Configuration-related files (e.g., constants, environment setup)
│   └── types/                # TypeScript interfaces and custom types used throughout the application
├── .env.example              # Example environment variables file
├── package.json              # Project metadata, scripts, and dependencies
├── tsconfig.json             # TypeScript compiler configuration
└── README.md                 # This documentation file

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/snaplife/snaplife-graphql-service.git
    cd snaplife-graphql-service
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Configuration

Create a `.env` file in the root directory of the project based on the `.env.example` file. This file will contain your environment-specific configurations, including the URLs of the backend microservices.

Example `.env` file:

**Important:** Never commit your `.env` file to version control.

### Running Locally

To start the GraphQL service in development mode:

```bash
npm run dev
# or
yarn dev