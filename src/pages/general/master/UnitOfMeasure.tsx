import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import GeneralMasterModal from "../../../components/forms/GeneralMasterModal";
import type { UOM } from "../../../types/General/uom";
import { createUom, deleteUomById, getUom, updateStatusUom, updateUom } from "../../../services/General/uomServices";

export default function UnitOfMeasureList() {
  const [uoms, setUoms] = useState<UOM[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUom, setEditingUom] = useState<UOM | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const loadData = useCallback(() => {
    getUom({ page, per_page: perPage, search }).then((res) => {
      setUoms(res.floors || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("uoms", uoms);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusUom(userId, { active: newStatus });

      setUoms((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      toast.success(`UOM ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update country status: ${error}`);
    }
  };

  const handleToggleStatus = async (uom: UOM) => {
    try {
      await updateStatusUom(uom.id, { active: !uom.active });
      loadData();
    } catch (error) {
      console.error("Error updating UOM status:", error);
    }
  };

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete UOM?")) return;
    try {
      await deleteUomById(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingUom(null);
    reset({
      name: "",
      uom_short_name: "",
      uom_abbreviation: "",
      uom_category: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (uom: UOM) => {
    setEditingUom(uom);
    reset({
      name: uom.name,
      uom_short_name: uom.uom_short_name,
      uom_abbreviation: uom.uom_abbreviation,
      uom_category: uom.uom_category,
      active: uom.active,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: UOM) => {
    try {
      if (editingUom?.id) {
        // Update existing UOM
        await updateUom(editingUom.id, data);
        toast.success("UOM updated successfully");
      } else {
        // Create new UOM
        await createUom(data);
        toast.success("UOM created successfully");
      }
      setIsModalOpen(false);
      setEditingUom(null);
      reset();
      loadData();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Error:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUom(null);
    reset();
  };

  const columns: {
    header: string;
    accessor: keyof UOM;
    render?: (uom: UOM, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_uom, index) => (page - 1) * perPage + index + 1,
    },
    { header: "UOM Name", accessor: "name" },
    { header: "Short Name", accessor: "uom_short_name" },
    { header: "Abbreviation", accessor: "uom_abbreviation" },
    { header: "Category", accessor: "uom_category" },

    {
      header: "Actions",
      accessor: "id",
      render: (uom) => (
        <div className="flex justify-center p-2 border rounded gap-2">
          <button
            onClick={() => handleEdit(uom)}
            className="cursor-pointer underline"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => setViewId(uom.id)}
            className="cursor-pointer underline"
            title="View"
          >
            <IoMdEye size={18} />
          </button>
          <button
            onClick={() => handleToggle(uom.id, uom.active)}
            className="cursor-pointer underline"
            title={uom.active ? "Disable" : "Enable"}
          >
            {uom.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => handelDelete(uom.id)}
            className="cursor-pointer underline"
            title="Delete"
          >
            <MdDelete size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="border rounded-md p-6 bg-white border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">UOM</h2>
        </div>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleCreate}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create UOM
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<UOM>
            data={uoms}
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
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <GeneralMasterModal
          title={editingUom ? "Edit UOM" : "Create UOM"}
          onClose={handleModalClose}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Row - UOM Name and Short Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  UOM Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name", {
                    required: "UOM name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters required",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter UOM name"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.name?.message as string}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("uom_short_name", {
                    required: "Short name is required",
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.uom_short_name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter short name"
                />
                {errors.uom_short_name && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.uom_short_name?.message as string}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row - Abbreviation and Category */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Abbreviation</label>
                <input
                  type="text"
                  {...register("uom_abbreviation")}
                  className="border p-3 rounded w-full border-gray-300"
                  placeholder="Enter abbreviation"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("uom_category", {
                    required: "Category is required",
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.uom_category ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter category"
                />
                {errors.uom_category && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.uom_category?.message as string}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 mt-6">
              <button
                type="submit"
                className="bg-red-800 text-white px-6 w-40 py-2.5 rounded hover:bg-red-900 transition-colors font-medium"
              >
                {editingUom ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="border border-gray-400 px-6 w-40 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </GeneralMasterModal>
      )}

      {/* View Modal */}
      {viewId && (
        <GeneralMasterModal
          title="UOM Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">UOM Name</span>
            <span>
              {uoms.find((uom) => uom.id === viewId)?.name}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Short Name</span>
            <span>{uoms.find((uom) => uom.id === viewId)?.uom_short_name}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Abbreviation</span>
            <span>{uoms.find((uom) => uom.id === viewId)?.uom_abbreviation}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Category</span>
            <span>{uoms.find((uom) => uom.id === viewId)?.uom_category}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Status</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                uoms.find((uom) => uom.id === viewId)?.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {uoms.find((uom) => uom.id === viewId)?.active
                ? "Active"
                : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end py-2">
            <button
              className="border border-red-800 text-red-800 px-4 py-2 rounded hover:bg-red-50"
              onClick={() => setViewId(null)}
            >
              Close
            </button>
          </div>
        </GeneralMasterModal>
      )}
    </div>
  );
}
