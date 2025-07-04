import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";

import DataTable from "../../../components/DataTable";
import GeneralMasterModal from "../../../components/forms/GeneralMasterModal";
import type { City } from "../../../types/General/cities";
import {
  createCity,
  deletCity,
  getCities,
  updateCity,
  updateCityStatus,
} from "../../../services/General/citiesService";
import SelectBox from "../../../components/forms/SelectBox";
import { getGeneralDropdown } from "../../../services/generalDropdown";
import { mapToOptions } from "../../../utils";

interface DropdownData {
  locations?: {
    states?: Array<{ id: number; name: string }>;
  };
}

export default function Cities() {
  const [states, setStates] = useState<City[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<City | null>(null);
  const [dropDown, setDropDown] = useState<DropdownData | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<City>();

  const loadData = useCallback(() => {
    console.log("Loading cities with params:", { page, per_page: perPage, search });
    getCities({ page, per_page: perPage, search }).then((res) => {
      console.log("Cities API response:", res);
      setStates(res.cities || []);
      setTotalCount(res.total_count || 0);
    }).catch((error) => {
      console.error("Error loading cities:", error);
    });
  }, [page, perPage, search]);

  console.log("states", states);

  useEffect(() => {
    getGeneralDropdown().then(setDropDown);
  }, []);

  const stateOptions = mapToOptions(dropDown?.locations?.states || []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateCityStatus(userId, { active: newStatus });

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

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete state?")) return;
    try {
      await deletCity(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingState(null);
    reset({
      city: "",
      city_code: "",
      state_id: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (state: City) => {
    setEditingState(state);
    reset({
      city: state.city,
      city_code: state.city_code,
      state_id: state.state_id,
      active: state.active,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: City) => {
    try {
      if (editingState?.id) {
        // Update existing state
        await updateCity(editingState.id, data);
        toast.success("State updated successfully");
      } else {
        // Create new state
        await createCity(data);
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
    accessor: keyof City;
    render?: (user: City, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "City Code", accessor: "city_code" },
    { header: "City", accessor: "city" },
    { header: "State Name", accessor: "state" },

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
          <h2 className="text-2xl font-bold">City</h2>
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
          <DataTable<City>
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
                  City Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("city_code", {
                    required: "State code is required",
                  })}
                  className={`border p-3 rounded w-full uppercase ${
                    errors.city_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., MH, UP, DL"
                />
                {errors.city_code && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.city_code.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("city", {
                    required: "City name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters required",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter City name"
                />
                {errors.city && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.city.message}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row - Country ID and TIN Number */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select State"
                  name="state_id"
                  control={control}
                  options={stateOptions}
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
          title="City Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">City Code</span>
            <span>
              {states.find((state) => state.id === viewId)?.city_code}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">City Name</span>
            <span>{states.find((state) => state.id === viewId)?.city}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">State</span>
            <span>{states.find((state) => state.id === viewId)?.state}</span>
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
