import { SignIn } from '@clerk/react';
import { useSearchParams } from 'react-router-dom';

export const LoginPage = () => {
    const [params] = useSearchParams();
    const requested = params.get('returnTo');
    const returnTo = requested?.startsWith('/') && !requested.startsWith('//') ? requested : '/';
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <SignIn routing="hash" fallbackRedirectUrl={returnTo} signUpUrl="/signup" />
        </main>
    );
};
