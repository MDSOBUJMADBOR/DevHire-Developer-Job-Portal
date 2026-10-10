import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow">

        <h1 className="text-2xl font-bold">
          My Profile
        </h1>

        <div className="mt-8 space-y-5">

          <div>
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="font-semibold">
              {user?.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {user?.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Account Type
            </p>

            <p className="font-semibold">
              {user?.role}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;