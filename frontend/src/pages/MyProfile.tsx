import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";

const MyProfile = () => {
  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="mx-auto max-w-4xl p-8">
        <div className="rounded-xl bg-white p-8 shadow">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="mt-2 text-gray-500">
              View your account information.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Full Name
              </label>

              <div className="rounded-lg border bg-gray-50 px-4 py-3">
                {user?.name}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Email
              </label>

              <div className="rounded-lg border bg-gray-50 px-4 py-3">
                {user?.email}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Role
              </label>

              <div className="rounded-lg border bg-gray-50 px-4 py-3">
                {user?.role}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Referral Code
              </label>

              <div className="rounded-lg border bg-gray-50 px-4 py-3 font-mono">
                {user?.referralCode}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;