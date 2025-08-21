import 'server-only';
import { createClient } from '@/lib/supabase/client';
import { redirect } from 'next/navigation';
import SetupForm from '@/client/components/SetupForm';

export default async function SetupPage() {
  const supabase = createClient();
  
  // Check if user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }

  // Check if user needs to set up password (invited users)
  if (user.email_confirmed_at && !user.last_sign_in_at) {
    // This is likely an invited user who needs to set up their account
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Complete your account setup
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You've been invited to join Poli Money Alpha. Please set up your password to continue.
            </p>
          </div>
          <SetupForm userEmail={user.email!} />
        </div>
      </div>
    );
  }

  // User is already set up, redirect to main app
  redirect('/');
}