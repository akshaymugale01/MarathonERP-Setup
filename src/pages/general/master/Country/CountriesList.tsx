import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { updateStatusUser } from "../../../../services/userService";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
// import { toast } from "react-toast";
import { toast } from "react-hot-toast";
import type { Country } from "../../../../types/countries";
import { getCountry } from "../../../../services/countryService";
import DataTable from "../../../../components/DataTable";

export default function CountriesList() {
  const [countries, setCountres] = useState<Country[]>([]);
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
    getCountry({ page, per_page: perPage, search }).then((res) => {
      setCountres(res.countries);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  // useEffect(() => {
  //   getUsers({ page: 1, per_page: 100 }).then((res) => setUsers(res.users));
  // }, []);

  console.log("users", countries);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusUser(userId, { active: newStatus });

      setCountres((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      toast.success(`Contries ${newStatus ? "enabled" : "disabled"}`, {
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
    accessor: keyof Country;
    render?: (user: Country, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_country, index) => index + 1,
    },
    { header: "Country Code", accessor: "country_code" },
    { header: "Region", accessor: "region" },
    { header: "Country Name", accessor: "name" },
    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <>
          <div className="flex p-2 border rounded gap-2">
            <a href={`countries/${user.id}/edit`} className=" underline">
              <MdEdit size={18} />
            </a>
            <a href={`countries/${user.id}/edit`} className=" underline">
              <IoMdEye size={18} />
            </a>

            <a
              onClick={() => handleToggle(user.id, user.active)}
              className="cursor-pointer underline"
            >
              {user.active ? (
                <BiCheckSquare size={24} className="text-green-600" />
              ) : (
                <BiSquare size={24} className="text-gray-400" />
              )}
            </a>
            <a href={`countries/${user.id}/edit`} className="underline">
              <MdDelete size={17} />
            </a>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="">
      <div className="border rounded-md p-6 bg-white border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          {/* Here Braed Script */}
        </div>
        <div className="flex justify-end items-center mb-4">
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
          <DataTable<Country>
            data={countries}
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
    </div>
  );
}
