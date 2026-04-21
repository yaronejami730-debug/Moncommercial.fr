import { requireOnboarded } from '@/lib/auth';
import CreateListingForm from './form';

export default async function CreateListingPage() {
  await requireOnboarded();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="display text-3xl text-ink">Nouvelle annonce</h1>
        <p className="text-ink-soft mt-2">Publiez une offre visible par la communauté.</p>
      </div>
      <CreateListingForm />
    </div>
  );
}
