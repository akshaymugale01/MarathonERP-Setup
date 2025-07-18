import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import type { Material } from "../../../../types/Admin/material";
import DataTable from "../../../../components/DataTable";
import {
  getMaterial,
  updateStatusMaterial,
} from "../../../../services/Purchase/materialsService";
import MaterialForm from "./MaterialForm";
// import MaterialModal from "../../../../components/forms/MaterialModal";

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  // const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "details">("create");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  useEffect(() => {
    getMaterial({ page, per_page: perPage, search }).then((res) => {
      setMaterials(res.materials);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("materials", materials);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusMaterial(userId, { active: newStatus });

      setMaterials((prev) =>
        prev.map((materials) =>
          materials.id === userId
            ? { ...materials, active: newStatus }
            : materials
        )
      );

      toast.success(`Material ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update Material status: ${error}`);
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
            <button
              onClick={() => {
                setMode("edit");
                setSelectedMaterial(user);
                setShowFormModal(true);
              }}
              className="underline"
            >
              <MdEdit size={18} />
            </button>

            <button
              onClick={() => {
                setMode("details");
                setSelectedMaterial(user);
                setShowFormModal(true);
              }}
              className="underline"
            >
              <IoMdEye size={18} />
            </button>
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
      <div className="border card rounded-md p-6 bg-white border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Materials</h2>
          {/* Here Braed Script */}
        </div>
        <div className="w-full max-h[80vh]">
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
            actionSlot={
              <button
                onClick={() => {
                  setMode("create");
                  setShowFormModal(true);
                }}
                className="bg-red-800 text-white px-4 py-2 rounded-md"
              >
                + Create Material
              </button>
            }
          />
        </div>
      </div>
      {/* <MaterialModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      >
        <MaterialForm
          onClose={() => setShowCreateModal(false)}
          mode={"create"}
        />
      </MaterialModal> */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-[80%] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {mode === "create"
                  ? "Create Material"
                  : mode === "edit"
                  ? "Edit Material"
                  : "Material Details"}
              </h2>
              <button onClick={() => setShowFormModal(false)}>Close</button>
            </div>
            <MaterialForm
              onClose={() => setShowFormModal(false)}
              mode={mode}
              material={selectedMaterial}
            />
          </div>
        </div>
      )}
    </div>
  );
}
