import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import OnboardingForm from './form';

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');
  if (user.onboardingCompleted && user.role) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-paper-warm py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center mb-6" aria-label="Centrale de l'Énergie — accueil">
            <Image
              src="/logo.png"
              alt="Centrale de l'Énergie"
              width={1092}
              height={190}
              priority
              className="h-20 w-auto"
            />
          </Link>
          <h1 className="display text-3xl md:text-4xl text-ink">
            Bienvenue sur <span className="text-brand">Centrale de l'Énergie</span>
          </h1>
          <p className="text-ink-soft mt-3 text-lg">
            Quelques informations pour activer votre compte.
          </p>
        </div>
        <OnboardingForm defaultName={user.name} email={user.email} />
      </div>
    </div>
  );
}
