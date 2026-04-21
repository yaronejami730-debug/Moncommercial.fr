import Image from 'next/image';
import Link from 'next/link';
import SignInForm from './form';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-warm py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center" aria-label="MonCommercial.fr — accueil">
            <Image
              src="/logo.png"
              alt="MonCommercial.fr"
              width={1092}
              height={190}
              priority
              className="h-16 w-auto"
            />
          </Link>
          <p className="text-ink-soft mt-3">Connectez-vous à votre compte</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-line p-6">
          <SignInForm />
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
