# Hercules Finance AI

Hercules Finance AI is an intelligent financial companion designed to empower gig economy workers by providing AI-driven tools for financial management, planning, and education. The application offers personalized insights, crisis management plans, and culturally relevant investment advice, all within a simple, multi-language interface supporting English, Hindi, and Marathi.

## Key Features

- **Dashboard**: A central hub to view recent transactions and your UPI ID. Includes a feature to simulate sending money to other UPI IDs.
- **Income Intelligence**: Forecasts weekly income and proactively identifies potential income dips by analyzing user-provided descriptions of their work and financial situation.
- **Family Finance**: A collaborative tool to manage and track shared expenses among family members, showing individual contributions and overall spending.
- **Personalized Crisis Plan**: Generates a concise, actionable plan to navigate financial shortfalls based on the user's income, expenses, savings, and location.
- **Cultural Investment Guidance**: Offers personalized investment advice that considers the user's cultural background and the context of traditional festivals (e.g., Diwali).
- **Emotional Stress Sensing**: Uses sentiment analysis to detect potential financial distress from user-provided text, helping to identify early warning signs.
- **Scam & Fraud Simulation**: An educational tool that simulates realistic scam scenarios (like phishing emails or fake calls) to help users learn how to identify and avoid financial fraud.
- **Multi-language Support**: The entire user interface can be switched between English, Hindi, and Marathi for greater accessibility.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (powered by Google's Gemini models)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Set Up Environment Variables

The application uses Genkit to connect to Google's AI models, which requires an API key.

1.  Create a new file named `.env` in the root of the project directory.
2.  Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add the key to your `.env` file:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 2. Install Dependencies

Open your terminal and run the following command to install the required packages:

```bash
npm install
```

### 3. Run the Development Server

Once the dependencies are installed, you can start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).
