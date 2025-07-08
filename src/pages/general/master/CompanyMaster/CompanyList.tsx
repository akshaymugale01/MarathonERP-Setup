import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import type { Company } from "../../../../types/General/companies";
import GeneralMasterModal from "../../../../components/forms/GeneralMasterModal";
import SelectBox from "../../../../components/forms/SelectBox";
import {
  createCompany,
  deleteCompany,
  getCompanySetup,
  updateCompany,
} from "../../../../services/General/companyServices";
import { getGeneralDropdown } from "../../../../services/generalDropdown";
import { mapToOptions } from "../../../../utils";
import DataTable from "../../../../components/DataTable";

export default function CompanyList() {
  const navigate = useNavigate();
  const [states, setStates] = useState<Company[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<Company | null>(null);
  const [dropDown, setDropDown] = useState([]);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Company>();

  const loadData = useCallback(() => {
    getCompanySetup({ page, per_page: perPage, search }).then((res) => {
      setStates(res.pms_company_setups || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("company", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateCompany(userId, { active: newStatus });

      setStates((prev) =>
        prev.map((state) =>
          state.id === userId ? { ...state, active: newStatus } : state
        )
      );

      toast.success(`State ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update state status: ${error}`);
    }
  };

  useEffect(() => {
    getGeneralDropdown().then(setDropDown);
  }, []);

  console.log("dropdown data", dropDown);

  const stateOptions = mapToOptions(dropDown?.locations?.countries || []);
  console.log("stateOptions", stateOptions);

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete state?")) return;
    try {
      await deleteCompany(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingState(null);
    reset({
      state: "",
      state_code: "",
      country_id: 0,
      tin_number: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (state: Company) => {
    navigate(`${state.id}/edit`);
  };

  const onSubmit = async (data: Company) => {
    try {
      if (editingState?.id) {
        // Update existing state
        await updateCompany(editingState.id, data);
        toast.success("State updated successfully");
      } else {
        // Create new state
        await createCompany(data);
        toast.success("State created successfully");
      }
      setIsModalOpen(false);
      setEditingState(null);
      reset();
      loadData();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Error:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingState(null);
    reset();
  };

  const columns: {
    header: string;
    accessor: keyof Company;
    render?: (company: Company, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Company Code", accessor: "company_code" },
    { header: "Company Name", accessor: "company_name" },
    {
      header: "Location",
      accessor: "office_address",
      render: (company) => {
        const addr = company.office_address;
        if (!addr) return "-";
        return `${addr.address || ""}, ${addr.pms_city || ""}, ${
          addr.pms_state || ""
        } ${addr.pin_code || ""}`.trim();
      },
    },
    {
      header: "Country",
      accessor: "office_address",
      render: (company) => {
        const country = company.office_address;
        if (!country) return "-";
        return `${country.pms_country || ""}`;
      },
    },
    {
      header: "State",
      accessor: "office_address",
      render: (company) => {
        const state = company.office_address;
        if (!state) return "-";
        return `${state.pms_state}`;
      },
    },
    {
      header: "City",
      accessor: "office_address",
      render: (company) => {
        const city = company.office_address;

        if (!city) return "-";
        return `${city.pms_city}`;
      },
    },
    {
      header: "Actions",
      accessor: "id",
      render: (state) => (
        <div className="flex justify-center p-2 border rounded gap-2">
          <button
            onClick={() => handleEdit(state)}
            className="cursor-pointer underline"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => navigate(`${state.id}/view`)}
            className="cursor-pointer underline"
            title="View"
          >
            <IoMdEye size={18} />
          </button>
          <button
            onClick={() => handleToggle(state.id, state.active)}
            className="cursor-pointer underline"
            title={state.active ? "Disable" : "Enable"}
          >
            {state.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => handelDelete(state.id)}
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
          <h2 className="text-2xl font-bold">Company Master</h2>
        </div>{" "}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => navigate("create")}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create Company
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<Company>
            data={states}
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
          title={editingState ? "Edit State" : "Create State"}
          onClose={handleModalClose}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Row - State Code and State Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  State Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("state_code", {
                    required: "State code is required",
                    pattern: {
                      value: /^[A-Z]{2,5}$/,
                      message: "State code should be 2-5 uppercase letters",
                    },
                  })}
                  className={`border p-3 rounded w-full uppercase ${
                    errors.state_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., MH, UP, DL"
                />
                {errors.state_code && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.state_code.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  State Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("state", {
                    required: "State name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters required",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter state name"
                />
                {errors.state && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.state.message}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row - Country ID and TIN Number */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select Country"
                  name="country_id"
                  control={control}
                  options={stateOptions}
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">TIN Number</label>
                <input
                  type="text"
                  {...register("tin_number")}
                  className="border p-3 rounded w-full border-gray-300"
                  placeholder="Enter TIN number"
                />
              </div>
            </div>

            {/* Third Row - Active Status
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                {...register("active")}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="active" className="font-medium text-gray-700">
                Active
              </label>
            </div> */}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 mt-6">
              <button
                type="submit"
                className="bg-red-800 text-white px-6 w-40 py-2.5 rounded hover:bg-red-900 transition-colors font-medium"
              >
                {editingState ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="border border-gray-400 px-6 py-2.5 w-40 rounded hover:bg-gray-50 transition-colors font-medium"
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
          title="State Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">State Code</span>
            <span>
              {states.find((state) => state.id === viewId)?.state_code}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">State Name</span>
            <span>{states.find((state) => state.id === viewId)?.state}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Country ID</span>
            <span>
              {states.find((state) => state.id === viewId)?.country_id}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">TIN Number</span>
            <span>
              {states.find((state) => state.id === viewId)?.tin_number}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Status</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                states.find((state) => state.id === viewId)?.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {states.find((state) => state.id === viewId)?.active
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
