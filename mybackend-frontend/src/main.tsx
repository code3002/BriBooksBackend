import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/react'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {publishableKey ? (
      <ClerkProvider publishableKey={publishableKey} signInUrl="/login" signUpUrl="/signup">
        <App />
      </ClerkProvider>
    ) : (
      <p>Set VITE_CLERK_PUBLISHABLE_KEY in mybackend-frontend/.env.local to run the app.</p>
    )}
  </StrictMode>,
)
