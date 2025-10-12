# Social Support Form Application

A multi-step form application built with **React**, **TypeScript**, and **Vite**.  
It integrates **OpenAI API** to help users generate text responses for financial assistance applications.

---

## Features

- Multi-step form (Personal, Family, Situation)
- AI-assisted text generation using OpenAI
- Internationalization support (English & Arabic)
- Form validation with **Yup** and **React Hook Form**
- Persistent state with **Redux Toolkit** and localStorage
- Mobile-first responsive design

---

## Requirements

- Node.js >= 18
- npm or yarn
- OpenAI API Key

---

## Getting Started

### 1. Clone the repository

``` bash
git clone <your-repo-url>
cd <your-repo-folder>

```
### 2. Install dependencies

```bash
npm install
or
yarn install

```

### 3. Set up environment variables

Create a .env file in the root folder:

VITE_OPENAI_KEY=your_openai_api_key_here
VITE_API_BASE_URL=your_backend_base_url
VITE_OPENAPI_URL=your_openapi_url

### 4. Run the development server

```bash
npm run dev 
or 
yarn dev

```

### 5. Build for production

```bash
npm run build
or
yarn build

```

### 6. Preview production build

```bash
npm run preview
or
yarn preview

```


### OpenAI API Integration

The application uses OpenAI GPT-3.5-Turbo for generating text responses.

How it works:

User opens the AI Helper modal for a field (Financial Situation, Employment Circumstances, Reason for Applying).

The app sends the applicant’s context to OpenAI using your API key.

OpenAI returns a professionally generated text.

User can edit, accept, or regenerate the text.


### Project Structure

src/
├─ components/          # React components for forms and AI helper
├─ store/               # Redux slices and store setup
├─ hooks/               # Custom React hooks
├─ services/            # API calls (OpenAI integration)
├─ types/               # TypeScript types
├─ i18n/                # Internationalization setup
├─ utils                # contants, storage and middlewares
└─ App.tsx              # Main App component