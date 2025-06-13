import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../../../services/userService";
import type { User } from "../../../../types/user";
import DataTable from "../../../../components/DataTable";
import { MdDelete, MdEdit } from "react-icons/md";

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // useEffect(() => {
  //   getUsers({ page: currentPage, per_page: perPage }).then((data) => {
  //     setUsers(data.users);
  //     setTotalPages(data.total_pages);
  //   });
  // }, [currentPage, perPage]);
  useEffect(() => {
    getUsers({ page, per_page: perPage, search }).then((res) => {
      setUsers(res.users);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  // useEffect(() => {
  //   getUsers({ page: 1, per_page: 100 }).then((res) => setUsers(res.users));
  // }, []);

  console.log("users", users);

  const columns: {
    header: string;
    accessor: keyof User;
    render?: (user: User, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_user, index) => index + 1,
    },
    { header: "Employee Id", accessor: "employee_code" },
    { header: "First Name", accessor: "firstname" },
    { header: "Middle Name", accessor: "middlename" },
    { header: "Last Name", accessor: "lastname" },
    { header: "Mobile", accessor: "mobile" },
    { header: "Email", accessor: "email" },
    { header: "Date of Birth", accessor: "birth_date" },
    { header: "Group Of Joining", accessor: "group_join_date" },
    { header: "Confirm Date", accessor: "confirm_date" },
    { header: "Last Working Date", accessor: "last_working_date" },
    { header: "Gender", accessor: "gender" },
    { header: "User Name", accessor: "username" },
    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <>
          <a
            href={`/users/${user.id}/edit`}
            className="text-blue-600 underline"
          >
            <MdEdit />
          </a>
          ,
          <a
            href={`/users/${user.id}/edit`}
            className="text-blue-600 underline"
          >
            <MdDelete />
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link
          to="create"
          className="bg-red-800 text-white px-4 py-2 rounded-md"
        >
          + Create User
        </Link>
      </div>

      {/* <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Sr No.</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={user?.id}>
              <td className="py-2 px-4">{(currentPage - 1) * perPage + index + 1}</td>
              <td className="py-2 px-4">{user?.firstname}</td>
              <td className="py-2 px-4 text-center">
                <Link to={`${user?.id}/edit`} className="text-blue-600 underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <div className="overflow-x-auto w-full max-h[80vh]">
        <DataTable<User>
          data={users}
          columns={columns}
          perPage={perPage}
          totalCount={totalCount}
          page={page}
          search={search}
          onPageChange={(p) => setPage(p)}
          onPerPageChange={(count) => {
            setPerPage(count);
            setPage(1);
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </div>

      {/* Pagination */}
      {/* <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
}
