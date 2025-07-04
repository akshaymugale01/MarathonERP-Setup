import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import {
  createStates,
  deleteStatesById,
  getStates,
  updateStates,
  updateStatusStates,
} from "../../../services/General/stateServices";
import DataTable from "../../../components/DataTable";
import type { States } from "../../../types/General/states";
import GeneralMasterModal from "../../../components/forms/GeneralMasterModal";
import SelectBox from "../../../components/forms/SelectBox";
import { getGeneralDropdown } from "../../../services/generalDropdown";
import { mapToOptions } from "../../../utils";

export default function StatesList() {
  const [states, setStates] = useState<States[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<States | null>(null);
  const [dropDown, setDropDown] = useState([]);
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<States>();

  const loadData = useCallback(() => {
    getStates({ page, per_page: perPage, search }).then((res) => {
      setStates(res.states || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("states", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusStates(userId, { active: newStatus });

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
    getGeneralDropdown().then(setDropDown)
  },[])

  console.log("dropdown data", dropDown);

  const stateOptions = mapToOptions(dropDown?.locations?.countries || [])
  console.log("stateOptions", stateOptions);

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete state?")) return;
    try {
      await deleteStatesById(id);
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

  const handleEdit = (state: States) => {
    setEditingState(state);
    reset({
      state: state.state,
      state_code: state.state_code,
      country_id: state.country_id,
      tin_number: state.tin_number,
      active: state.active,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: States) => {
    try {
      if (editingState?.id) {
        // Update existing state
        await updateStates(editingState.id, data);
        toast.success("State updated successfully");
      } else {
        // Create new state
        await createStates(data);
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
    accessor: keyof States;
    render?: (user: States, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "State Code", accessor: "state_code" },
    { header: "State Name", accessor: "state" },
    { header: "Country", accessor: "country_name" },
    { header: "TIN Number", accessor: "tin_number" },

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
            onClick={() => setViewId(state.id)}
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
          <h2 className="text-2xl font-bold">States</h2>
        </div>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleCreate}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create State
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<States>
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
