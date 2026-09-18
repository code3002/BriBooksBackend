import { SignUp } from '@clerk/react';

export const SignupPage = () => (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <SignUp routing="hash" fallbackRedirectUrl="/" signInUrl="/login" />
    </main>
);
