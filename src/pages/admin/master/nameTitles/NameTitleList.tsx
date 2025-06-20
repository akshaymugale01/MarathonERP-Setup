// NameTitleList.tsx

import DataTable from "../../../../components/DataTable";
import type { NameTitle } from "../../../../types/nameTitle";
import { useCallback, useEffect, useState } from "react";
import {
  getnameTitles,
  updateStatusNameTitle,
  getNameTitleById,
  createNameTitle,
  updateNameTitle,
  deleteName,
} from "../../../../services/nameTitles";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import toast from "react-hot-toast";
import Modal from "../../../../components/forms/Modal";

export default function NameTitleList() {
  const [nameTitles, setNameTitles] = useState<NameTitle[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [formModal, setFormModal] = useState<NameTitle | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const loadData = useCallback(() => {
    getnameTitles({ page, per_page: perPage, search }).then((res) => {
      setNameTitles(res.name_titles);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await deleteName(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await updateStatusNameTitle(id, { active: !currentStatus });
      toast.success("Status updated");
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = async (id: number) => {
    const data = await getNameTitleById(id);
    setFormModal({
      id: data.id,
      name: data.name,
      organization_id: data.organization_id ?? 0,
      organization: data.organization ?? [],
      code: data.code ?? "",
      active: data.active ?? false,
      deleted: data.deleted ?? false,
    });
  };

  const handleCreate = () => {
    setFormModal({
      id: 0,
      name: "",
      organization_id: 0,
      organization: [],
      code: "",
      active: false,
      deleted: false,
    });
  };

  const handleSave = async () => {
    try {
      if (formModal?.id && formModal.id !== 0) {
        await updateNameTitle(formModal.id, { name: formModal.name });
        toast.success("Updated successfully");
      } else {
        await createNameTitle({
          name: formModal?.name || "",
          id: 0,
          organization_id: 0,
          organization: [],
          code: "",
          active: false,
          deleted: false,
        });
        toast.success("Created successfully");
      }
      setFormModal(null);
      loadData();
    } catch {
      toast.error("Save failed");
    }
  };

  const columns = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_row: NameTitle, index: number) => (page - 1) * perPage + index + 1,
    },
    { header: "Name", accessor: "name" },
    {
      header: "Actions",
      accessor: "id",
      render: (row: NameTitle) => (
        <div className="flex gap-2">
          <span onClick={() => handleEdit(row.id)} className="cursor-pointer"><MdEdit size={18} /></span>
          <span onClick={() => setViewId(row.id)} className="cursor-pointer"><IoMdEye size={18} /></span>
          <span onClick={() => handleToggle(row.id, row.active)} className="cursor-pointer">
            {row.active ? <BiCheckSquare size={24} className="text-green-600" /> : <BiSquare size={24} className="text-gray-400" />}
          </span>
          <span onClick={() => handleDelete(row.id)} className="cursor-pointer"><MdDelete size={17} /></span>
        </div>
      ),
    },
  ];

  const startRecord = (page - 1) * perPage + 1;
  const endRecord = Math.min(startRecord + perPage - 1, totalCount);

  return (
    <>
      <div className="border rounded-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Name Titles</h2>
          <button onClick={handleCreate} className="bg-red-800 text-white px-4 py-2 rounded-md">
            + Create Name Title
          </button>
        </div>

        <DataTable<NameTitle>
          data={nameTitles}
          columns={columns}
          perPage={perPage}
          totalCount={totalCount}
          page={page}
          search={search}
          onPageChange={(p) => setPage(p)}
          onPerPageChange={(count) => {
            setPerPage(count);
            setPage(1); // reset page to 1 when per page changes
          }}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        <div className="mt-4 text-sm text-gray-500">
          Showing {totalCount === 0 ? 0 : startRecord} to {endRecord} of {totalCount} entries
        </div>
      </div>

      {/* Create / Edit Modal */}
      {formModal && (
        <Modal title={formModal.id ? "Edit Name Title" : "Create Name Title"} onClose={() => setFormModal(null)}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Name Title *</label>
            <input
              type="text"
              value={formModal.name}
              onChange={(e) => setFormModal((prev) => prev ? { ...prev, name: e.target.value } : null)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setFormModal(null)} className="border border-gray-400 px-4 py-2 rounded">Cancel</button>
            <button onClick={handleSave} className="bg-red-800 text-white px-4 py-2 rounded">Save</button>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {viewId && (
        <Modal title="Name Title Details" onClose={() => setViewId(null)}>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Name Title</span>
            <span>{nameTitles.find((nt) => nt.id === viewId)?.name}</span>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={() => setViewId(null)} className="border border-red-800 text-red-800 px-4 py-2 rounded">Close</button>
          </div>
        </Modal>
      )}
    </>
  );
}
