# Neuro AI 🤖

Neuro AI is a modern, open-source chatbot application built with Next.js and powered by the Gemini API. It offers a seamless and interactive chat experience with real-time streaming responses, all wrapped in a clean and user-friendly interface. This project serves as a great starting point for building your own AI-powered applications.

**Live URL:** [https://the-neuro-ai.vercel.app/](https://the-neuro-ai.vercel.app/)

## ✨ Features

-   **🧠 Intelligent Conversations:** Powered by the state-of-the-art Gemini API for natural and insightful responses.
-   **⚡ Real-time Streaming:** Get instant, word-by-word responses from the AI for a dynamic chat experience.
-   **📄 Markdown Support:** Responses are rendered with basic Markdown support, including bold text and line breaks.
-   **📖 Chat History:** Your conversations are saved locally, so you can pick up where you left off.
-   **📱 Mobile-First Design:** The application is designed to be mobile-friendly, with a slide-in history panel and a clean layout.
-   **🔒 Prompt Injection Defense:** The system prompt has been carefully crafted to make the AI more resilient to prompt injection attacks, ensuring the conversation stays on track.
-   **💻 Developer-Friendly:** The codebase is well-structured and easy to understand, making it simple to customize and extend.

## 🛠️ Technologies Used

-   **[Next.js](https://nextjs.org/):** A popular React framework for building server-side rendered and static web applications.
-   **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
-   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
-   **[Gemini API](https://ai.google.dev/):** The AI model from Google that powers the chatbot's responses.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later) and npm installed on your machine.
-   A Gemini API key. You can get one from the [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/thepratikguptaa/neuro-ai.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd neuro-ai
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Create a `.env.local` file in the root of the project and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key
    ```
5.  Run the development server:
    ```sh
    npm run dev
    ```
6.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

## 📂 Project Structure

The project follows the standard Next.js `app` directory structure:

```
.
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.js  // Handles non-streaming chat requests
│   │   └── chat-stream/
│   │       └── route.js  // Handles streaming chat requests
│   ├── globals.css       // Global CSS styles
│   ├── layout.js         // Main layout of the application
│   └── page.js           // The main page of the application
├── public/               // Static assets like images and icons
├── .env.example          // Example environment file
├── next.config.mjs       // Next.js configuration
├── package.json          // Project dependencies and scripts
└── README.md             // This file
```
