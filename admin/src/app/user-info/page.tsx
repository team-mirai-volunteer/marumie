import { createSupabaseServerClient, getUserRoleFromMetadata } from "@/lib/supabase/server";

export default async function UserInfoPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const role = getUserRoleFromMetadata(user);

  return (
    <div className="card">
      <h1>User Info</h1>
      {user ? (
        <>
          <p>
            <b>ID:</b> {user.id}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Role:</b> {role ?? "(none)"}
          </p>
        </>
      ) : (
        <p className="muted">Not signed in</p>
      )}
    </div>
  );
}
