import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteUser,
  getUsers,
  updateStatusUser,
} from "../../../../services/Admin/userService";
import type { User } from "../../../../types/Admin/user";
import DataTable from "../../../../components/DataTable";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
// import { toast } from "react-toast";
import { toast } from "react-hot-toast";
import { fetchServiceBoqs } from "../../../services/Engineering/serviceBoq";

export default function BoqList() {
  const [users, setUsers] = useState<[]>([]);
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
    fetchServiceBoqs({ page, per_page: perPage, search }).then((res) => {
      setUsers(res.users);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  // useEffect(() => {
  //   getUsers({ page: 1, per_page: 100 }).then((res) => setUsers(res.users));
  // }, []);

  console.log("users", users);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      toast.success("User deleted successfully");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusUser(userId, { active: newStatus });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      toast.success(`User ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update user status: ${error}`);
    }
  };

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
    { header: "Company Name", accessor: "company_name" },
    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <div className="flex p-2 border rounded gap-2">
          <Link to={`${user.id}/edit`} className="underline" title="Edit">
            <MdEdit size={18} />
          </Link>
          <Link to={`${user.id}/details`} className="underline" title="View">
            <IoMdEye size={18} />
          </Link>
          <span
            onClick={() => handleToggle(user.id, user.active)}
            className="cursor-pointer underline"
            title={user.active ? "Disable" : "Enable"}
          >
            {user.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </span>
          {/* If you want a delete action, you can add a handler here */}
          <span
            onClick={() => handleDelete(user.id)}
            className="underline"
            title="Delete"
          >
            <MdDelete size={17} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="border rounded-md card bg-white">
      <div className="flex p-3 justify-between">
        <h2 className="text-2xl font-bold">BOQ</h2>
      </div>
      <div className="w-full max-h-[80vh]">
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
          actionSlot={
            <Link
              to="create"
              className="bg-red-800 text-white px-4 py-2 rounded-md"
            >
              + Create BOQ
            </Link>
          }
        />
      </div>
    </div>
  );
}
