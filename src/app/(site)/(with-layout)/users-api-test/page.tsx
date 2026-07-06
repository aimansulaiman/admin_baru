import { getUsers } from "@/api/userApi";

export default async function UsersApiTestPage() {
  const users = await getUsers();

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <h1 className="mb-6 text-2xl font-bold text-dark dark:text-white">
        Users API Test
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-stroke text-left dark:border-dark-3">
              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                Name
              </th>
              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                Email
              </th>
              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                Role
              </th>
              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-stroke dark:border-dark-3"
              >
                <td className="px-4 py-4 text-dark dark:text-white">
                  {user.name}
                </td>
                <td className="px-4 py-4">{user.email}</td>
                <td className="px-4 py-4 capitalize">{user.role}</td>
                <td className="px-4 py-4 capitalize">{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}