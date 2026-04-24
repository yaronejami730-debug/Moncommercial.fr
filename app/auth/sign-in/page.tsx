import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import SignInForm from './form';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-warm py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center" aria-label="Centrale de l'Énergie — accueil">
            <Image
              src="/logo.png"
              alt="Centrale de l'Énergie"
              width={1092}
              height={190}
              priority
              className="h-16 w-auto"
            />
          </Link>
          <p className="text-ink-soft mt-3">Connectez-vous à votre compte</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-line p-6">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
        <p className="text-center text-sm text-ink-soft mt-6">
          Pas encore de compte ?{' '}
          <Link href="/auth/sign-up" className="text-brand font-bold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
