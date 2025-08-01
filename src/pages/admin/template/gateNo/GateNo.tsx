// NameTitleList.tsx
import { useCallback, useEffect, useState } from "react";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import toast from "react-hot-toast";
import DataTable from "../../../../components/DataTable";
import Modal from "../../../../components/forms/Modal";
import type { GateNumber } from "../../../../types/Admin/gateNumber";
import {
  createGateNumber,
  deleteGateNumber,
  getGateNumber,
  getGateNumberById,
  updateStatusGateNumber,
} from "../../../../services/Admin/gateNumberServices";
import { getDropdownData } from "../../../../services/setupDropDownService";
import SelectBox from "../../../../components/forms/SelectBox";
import { useForm } from "react-hook-form";

export default function GateNumber() {
  //   const { control, watch } = useForm<GateNumber>();
  const { control, watch, setValue, register, handleSubmit } =
    useForm<GateNumber>();
  const [departments, setDepartments] = useState<GateNumber[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dropdown, setDropdowns] = useState({
    companies: [],
    projects: [],
    sites: [],
  });

  console.log("gate no drops", dropdown);

  useEffect(() => {
    getDropdownData().then((res) => {
      setDropdowns({
        companies: res.companies || [],
        projects: res.projects || [],
        sites: res.sites || [],
      });
    });
  }, []);

  // console.log("dropdwons", dropdown);

  const [formModal, setFormModal] = useState<GateNumber | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const loadData = useCallback(() => {
    getGateNumber({ page, per_page: perPage, search }).then((res) => {
      console.log("response ", res);

      const response = res?.gate_numbers;
      setDepartments(response);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  watch("project");

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete?")) return;
    try {
      await deleteGateNumber(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await updateStatusGateNumber(id, { active: !currentStatus });
      toast.success("Status updated");
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleEdit = async (id: number) => {
    const data = await getGateNumberById(id);
    setFormModal({
      id: 0,
      gate_number: "",
      company_id: 0,
      project_id: 0,
      site_id: 0,
      company: "",
      project: "",
      site: "",
      pms_site_id: 0,
      active: true,
      deleted: false,
    });

    // Set form values for editing
    setValue("gate_number", data.gate_number);
    setValue("company_id", data.company_id);
    setValue("project_id", data.project_id);
    setValue("site_id", data.site_id);
  };

  const handleCreate = () => {
    setFormModal({
      id: 0,
      gate_number: "",
      company_id: 0,
      project_id: 0,
      site_id: 0,
      company: "",
      project: "",
      site: "",
      pms_site_id: 0,
      active: true,
      deleted: false,
    });

    // Reset form values
    setValue("gate_number", "");
    setValue("company_id", 0);
    setValue("project_id", 0);
    setValue("site_id", 0);
  };

  const handleSave = async (data: GateNumber) => {
    try {
      if (formModal?.id && formModal.id !== 0) {
        await updateStatusGateNumber(formModal.id, {
          gate_number: data.gate_number,
          company_id: data.company_id,
          project_id: data.project_id,
          site_id: data.site_id,
          active: formModal.active,
          deleted: formModal.deleted,
        });
        toast.success("Updated successfully");
      } else {
        await createGateNumber({
          gate_number: data.gate_number,
          company_id: data.company_id,
          project_id: data.project_id,
          site_id: data.site_id,
          active: true,
          deleted: false,
        } as GateNumber);
        toast.success("Created successfully");
      }
      setFormModal(null);
      loadData();
    } catch {
      toast.error("Save failed");
    }
  };

  const columns: {
    header: string;
    accessor: keyof GateNumber;
    render?: (user: GateNumber, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_row: GateNumber, index: number) =>
        (page - 1) * perPage + index + 1,
    },
    { header: "Gate Number", accessor: "gate_number" },
    { header: "Company", accessor: "company" },
    { header: "Project", accessor: "project" },
    { header: "Sub-Project", accessor: "site" },

    {
      header: "Actions",
      accessor: "id",
      render: (row: GateNumber) => (
        <div className="flex gap-2 items-center justify-center rounded border">
          <span onClick={() => handleEdit(row.id)} className="cursor-pointer">
            <MdEdit size={18} />
          </span>
          <span onClick={() => setViewId(row.id)} className="cursor-pointer">
            <IoMdEye size={18} />
          </span>
          <span
            onClick={() => handleToggle(row.id, row.active)}
            className="cursor-pointer"
          >
            {row.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </span>
          <span onClick={() => handleDelete(row.id)} className="cursor-pointer">
            <MdDelete size={17} />
          </span>
        </div>
      ),
    },
  ];

  const companies: {
    id: number | string;
    company_name: string;
    projects?: any[];
  }[] = dropdown?.companies || [];
  const projects: any[] = dropdown?.projects || [];
  const sites: any[] = dropdown?.sites || [];

  const companyOptions = companies.map((c) => ({
    value: c.id,
    label: c.company_name,
  }));

  const selectedCompany = watch("company_id");
  const selectedProject = watch("project_id");

  // Projects belonging to selected company
  const filteredProjects = projects.filter(
    (project) => String(project.company_id) === String(selectedCompany)
  );

  const projectOptions = filteredProjects.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  // Reset project and site when company changes
  useEffect(() => {
    setValue("project_id", 0);
    setValue("site_id", 0);
  }, [selectedCompany]);

  // Find selected project
  const selectedProjectObj = filteredProjects.find(
    (p) => String(p.id) === String(selectedProject)
  );

  // Sites belonging to selected project
  const filteredSites = sites.filter(
    (site) => String(site.project_id) === String(selectedProject)
  );

  const siteOptions = filteredSites.map((s) => ({
    value: s.id,
    label: s.name,
  }));

  // Reset site when project changes
  useEffect(() => {
    setValue("site_id", 0);
  }, [selectedProject]);

  return (
    <>
      <div className="border rounded-md p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gate Number</h2>
          <button
            onClick={handleCreate}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create Gate Number
          </button>
        </div>

        <DataTable<GateNumber>
          data={departments}
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
      </div>

      {/* Create / Edit Modal */}
      {formModal && (
        <div className="bg-black bg-opacity-40 flex justify-center items-center z-50 min-h-screen w-full left-0 top-0 absolute">
          <div className="bg-white p-6 rounded-lg shadow-lg relative mx-auto my-8 inline-block">
            <h2 className="text-2xl font-semibold mb-4 text-red-800">
              {formModal.id ? "Edit Gate Number" : "Create Gate Number"}
            </h2>
            <button
              onClick={() => setFormModal(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✖
            </button>
            <div className="grid grid-cols-4 gap-x-4 gap-y-2 border-b py-2">
              {/* Gate Number */}
              <label className="block mb-2 font-medium">
                Gate Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Gate Number"
                {...register("gate_number", { required: true })}
                className="border p-2 rounded w-full"
              />

              <label>Company</label>
              <SelectBox
                name="company_id"
                control={control}
                options={companyOptions}
                placeholder="Select Company"
              />
              <label>Project</label>
              <SelectBox
                name="project_id"
                control={control}
                options={projectOptions}
                placeholder="Select Project"
                isDisabled={!selectedCompany}
              />
              <label>Sub-Project</label>
              <SelectBox
                name="site_id"
                control={control}
                options={siteOptions}
                placeholder="Select Sub-Project"
                isDisabled={!selectedProject}
              />
            </div>
            <div className="flex mt-3 justify-end gap-2">
              <button
                onClick={() => setFormModal(null)}
                className="border border-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(handleSave)}
                className="bg-red-800 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewId && (
        <Modal title="Gate Number Details" onClose={() => setViewId(null)}>
          <div className="grid grid-cols-4 gap-2 gap-y-2 border-b py-2">
            <span className="font-semibold">
              Gate Number <span className="text-red-700">-</span>
            </span>
            <span>
              {departments.find((nt) => nt.id === viewId)?.gate_number}
            </span>

            <span className="font-semibold">
              Company <span className="text-red-700">-</span>{" "}
            </span>
            <span>{departments.find((nt) => nt.id === viewId)?.company}</span>

            <span className="font-semibold">
              Project <span className="text-red-700">-</span>{" "}
            </span>
            <span>{departments.find((nt) => nt.id === viewId)?.project}</span>

            <span className="font-semibold">
              Site <span className="text-red-700">-</span>{" "}
            </span>
            <span>{departments.find((nt) => nt.id === viewId)?.site}</span>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setViewId(null)}
              className="border border-red-800 text-red-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
