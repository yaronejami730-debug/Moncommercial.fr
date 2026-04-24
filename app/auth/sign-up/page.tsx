import Image from 'next/image';
import Link from 'next/link';
import SignUpForm from './form';

export default function SignUpPage() {
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
          <p className="text-ink-soft mt-3">Rejoignez la plateforme énergie B2B</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-line p-6">
          <SignUpForm />
        </div>
        <p className="text-center text-sm text-ink-soft mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/sign-in" className="text-brand font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
