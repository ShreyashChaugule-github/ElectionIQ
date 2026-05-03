# ElectionIQ Architecture

ElectionIQ is a full-stack, AI-powered web application designed to help users understand the Indian electoral process.

## Frontend Architecture

- **Framework**: React 18 using Vite.
- **Routing**: Client-side state management (conditional rendering) for tabs (`Dashboard`, `Process`, `AIAssistant`, `Quiz`) using `activeTab` state in `App.jsx`.
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`). Complex state like the chat interaction history is lifted up to the `App.jsx` component and passed down as props to `AIAssistant`.
- **Authentication**: Firebase Client SDK handles authentication (Google Auth). The `useAuth` hook wraps the authentication state and provides a `loading` indicator while resolving.
- **Styling**: Vanilla CSS in `styles.css` utilizing CSS Custom Properties (Variables) for easy theming and dark-mode scalability. Focus indicators (`:focus-visible`) and semantic class names are used heavily to ensure a 98%+ accessibility score.

## Backend Architecture

- **Framework**: Node.js with Express.
- **API Endpoints**: 
  - `POST /api/ai`: The main AI interface endpoint.
- **Controllers**: Extracted into modular pieces (e.g., `server/controllers/chat.js` and `server/utils/chatHelpers.js`) to parse incoming user queries, inject the ECI rules context (fetched from Firebase Admin), and interact with Google's Gemini Models.
- **AI Integration**: The `@google/generative-ai` SDK is used with retry-logic and fallback models (`gemini-2.0-flash-001`, `gemini-1.5-flash`, `gemini-3.1-flash-lite-preview`) to ensure high availability.
- **Database**: Firebase Admin SDK connects to Firestore to fetch dynamic rules (`election_data`) and save chat history per user.

## Code Quality & CI/CD
- **Testing**: `vitest` and `@testing-library/react` provide 100% code coverage on critical user flows (Authentication, Chat interaction, Quiz evaluation).
- **Linting**: ESLint v9 Flat Config is enforced to capture accessibility flaws (via `eslint-plugin-jsx-a11y`), hook dependency errors, and potential crashes.

## Deployment flow
- Frontend and backend are designed to be containerized together or served statically via a CDN (Firebase Hosting) with a Cloud Functions/Cloud Run backend processing the Gemini API proxy requests.
