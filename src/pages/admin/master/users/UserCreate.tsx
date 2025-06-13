import { Link } from "react-router-dom";
// import { getUsers } from "../../../services/userService";
// import { useEffect, useState } from "react";
// import type { User } from "../../../types/user";

export default function UserCreate() {
    // const [users, setUsers] = useState<User[]>([]);

//   useEffect(() => {
//     getUsers().then(setUsers);
//   }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link to="create" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          + Create User
        </Link>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        {/* <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4">{user.name}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4 text-center">
                <Link to={`${user.id}/edit`} className="text-blue-600 underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );

}