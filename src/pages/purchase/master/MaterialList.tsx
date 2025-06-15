import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
// import { toast } from "react-toast";
import { toast } from "react-hot-toast";
import type { Material } from "../../../types/material";
import DataTable from "../../../components/DataTable";
import { updateStatusUser } from "../../../services/userService";
import { getMaterial } from "../../../services/materialsService";

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
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
    getMaterial({ page, per_page: perPage, search }).then((res) => {
      setMaterials(res.materials);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  // useEffect(() => {
  //   getUsers({ page: 1, per_page: 100 }).then((res) => setUsers(res.users));
  // }, []);

  console.log("users", materials);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusUser(userId, { active: newStatus });

      setMaterials((prev) =>
        prev.map((materials) =>
          materials.id === userId
            ? { ...materials, active: newStatus }
            : materials
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
    accessor: keyof Material;
    render?: (user: Material, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_user, index) => index + 1,
    },
    { header: "Name", accessor: "name" },
    { header: "WBS Tag", accessor: "wbs_tag" },
    { header: "Inventory Type", accessor: "inventory_type" },
    // { header: "Sub Type", accessor: "inventory_sub_type_id" },
    { header: "Material Description", accessor: "material_description" },
    // { header: "Specification", accessor: "specification" },
    {
      header: "Image",
      accessor: "attachments",
      render: (material) => {
        const attachments = material.attachments;
        if (!attachments || attachments.length === 0) return "No image";
        const imageUrl = attachments[0].doc_path;
        return (
          <img
            src={imageUrl}
            alt="Attachment"
            style={{ width: 60, height: 60 }}
          />
        );
      },
    },
    { header: "UOM", accessor: "uom_name" },
    { header: "Created By", accessor: "created_by_id" },
    { header: "Material Code", accessor: "material_code" },
    { header: "Organization", accessor: "organization_id" },
    { header: "Created At", accessor: "created_at" },
    { header: "Updated At", accessor: "updated_at" },
    { header: "Available Quantity", accessor: "available_quantity" },
    { header: "Lead Time", accessor: "lead_time" },
    { header: "HSN Code", accessor: "hsn_code" },
    { header: "MTC Required", accessor: "mtc_required" },
    { header: "Perishable", accessor: "perishable" },
    { header: "Perishable Time", accessor: "perishable_time" },
    { header: "Warranty Period", accessor: "warranty_period" },
    { header: "Warranty Remarks", accessor: "warranty_remarks" },
    { header: "Stock Type", accessor: "stock_type" },
    { header: "Material Tag (Old)", accessor: "materil_tag" },
    { header: "Material Category", accessor: "material_category" },
    { header: "Urgent Lead Time", accessor: "urgent_lead_time" },
    { header: "Benchmark Lead Time", accessor: "benchmark_lead_time" },
    { header: "Manufacture Tolerance", accessor: "manufacture_tolerance" },
    { header: "Breakage Tolerance", accessor: "breakage_tolerance" },
    { header: "Wastage Tolerance", accessor: "wastage_tolerance" },
    { header: "Remark", accessor: "remark" },
    { header: "Conveyance", accessor: "conveyance" },
    { header: "Min Order Qty", accessor: "minimum_order_quantity" },
    { header: "Perishable Time Type", accessor: "perishable_time_type" },
    { header: "Warranty Time Type", accessor: "typical_warranty_time_type" },
    { header: "Typical Warranty Time", accessor: "typical_warranty_time" },
    { header: "Material Tag", accessor: "material_tag" },
    { header: "Purchase User ID", accessor: "purchase_user_id" },
    { header: "Is QC", accessor: "is_qc" },
    { header: "Active", accessor: "active" },
    { header: "Deleted", accessor: "deleted" },

    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <>
          <div className="flex p-2 border rounded gap-2">
            <a href={`users/${user.id}/edit`} className=" underline">
              <MdEdit size={18} />
            </a>
            <a href={`users/${user.id}/edit`} className=" underline">
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
            <a href={`users/${user.id}/edit`} className="underline">
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
          <DataTable<Material>
            data={materials}
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
