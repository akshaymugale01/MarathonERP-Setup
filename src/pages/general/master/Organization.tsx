import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";

import DataTable from "../../../components/DataTable";
import GeneralMasterModal from "../../../components/forms/GeneralMasterModal";
import {
  createLocation,
  deletLocation,
  getLocation,
  updateLocation,
  updateLocationStatus,
} from "../../../services/General/locationServices";
import SelectBox from "../../../components/forms/SelectBox";
import { getGeneralDropdown } from "../../../services/generalDropdown";
import { mapToOptions } from "../../../utils";

interface DropdownData {
  locations?: {
    countries?: Array<{ id: number; name: string }>;
    states?: Array<{ id: number; name: string; country_id: number }>;
    cities?: Array<{ id: number; name: string; state_id: number }>;
  };
}

export default function Locations() {
  const [states, setStates] = useState<Location[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<Location | null>(null);
  const [dropDown, setDropDown] = useState<DropdownData | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<Location>();

  // Watch for changes in country and state selection
  const watchedCountryId = watch("pms_countries_id");
  const watchedStateId = watch("city_states_id");

  const loadData = useCallback(() => {
    console.log("Loading locations with params:", {
      page,
      per_page: perPage,
      search,
    });
    getLocation({ page, per_page: perPage, search })
      .then((res) => {
        // console.log("Locations API response:", res);
        // Handle different possible response structures - check for cities property
        const locations = res?.cities || res?.locations || [];
        setStates(Array.isArray(locations) ? locations : []);
        setTotalCount(res.total_count || 0);
      })
      .catch((error) => {
        console.error("Error loading locations:", error);
        toast.error("Failed to load locations");
      });
  }, [page, perPage, search]);

  //   console.log("states", states);

  useEffect(() => {
    getGeneralDropdown().then(setDropDown);
  }, []);

  // Create options for dropdowns
  const countryOptions = mapToOptions(dropDown?.locations?.countries || []);

  // Filter states based on selected country
  const stateOptions = mapToOptions(
    dropDown?.locations?.states?.filter(
      (state) => state.country_id === watchedCountryId
    ) || []
  );

  // Filter cities based on selected state
  const cityOptions = mapToOptions(
    dropDown?.locations?.cities?.filter(
      (city) => city.state_id === watchedStateId
    ) || []
  );

  //   console.log("Dropdown options:", {
  //     countries: countryOptions.length,
  //     states: stateOptions.length,
  //     cities: cityOptions.length,
  //     watchedCountryId,
  //     watchedStateId,
  //     editingState: editingState?.id
  //   });

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (watchedCountryId && !editingState) {
      // Only reset if we're not editing
      // Reset state and city when country changes
      reset((prev) => ({
        ...prev,
        city_states_id: 0,
        pms_cities_id: 0,
      }));
    }
  }, [watchedCountryId, reset, editingState]);

  useEffect(() => {
    if (watchedStateId && !editingState) {
      // Only reset if we're not editing
      // Reset city when state changes
      reset((prev) => ({
        ...prev,
        pms_cities_id: 0,
      }));
    }
  }, [watchedStateId, reset, editingState]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateLocationStatus(userId, { active: newStatus });

      setStates((prev) =>
        prev.map((state) =>
          state.id === userId ? { ...state, active: newStatus } : state
        )
      );

      toast.success(`Location ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update location status: ${error}`);
    }
  };

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete location?")) return;
    try {
      await deletLocation(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingState(null);
    reset({
      location: "",
      location_code: "",
      city_states_id: 0,
      pms_cities_id: 0,
      pms_countries_id: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (state: Location) => {
    console.log("Editing state:", state);
    setEditingState(state);

    // Set the form values for editing
    const formValues = {
      location: state.location,
      location_code: state.location_code,
      city_states_id: state.city_states_id,
      pms_cities_id: state.pms_cities_id,
      pms_countries_id: state.pms_countries_id,
      active: state.active,
    };

    console.log("Setting form values:", formValues);
    reset(formValues);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Location) => {
    try {
      if (editingState?.id) {
        // Update existing state
        await updateLocation(editingState.id, data);
        toast.success("Location updated successfully");
      } else {
        // Create new state
        await createLocation(data);
        toast.success("Location created successfully");
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
    accessor: keyof Location;
    render?: (user: Location, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Location Code", accessor: "location_code" },
    { header: "Location", accessor: "location" },
    { header: "Country Name", accessor: "country_name" },
    { header: "State Name", accessor: "state_name" },
    { header: "City Name", accessor: "city_name" },
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
          <h2 className="text-2xl font-bold">Location</h2>
        </div>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleCreate}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create Location
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<Location>
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
          title={editingState ? "Edit Location" : "Create Location"}
          onClose={handleModalClose}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Row - State Code and State Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Location Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("location_code", {
                    required: "Location code is required",
                  })}
                  className={`border p-3 rounded w-full uppercase ${
                    errors.location_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., MH, UP, DL"
                />
                {errors.location_code && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.location_code.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Location Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters required",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter Location name"
                />
                {errors.location && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.location.message}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row - Country and State */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select Country"
                  name="pms_countries_id"
                  control={control}
                  options={countryOptions}
                />
                {errors.pms_countries_id && (
                  <span className="text-red-500 text-sm mt-1 block">
                    Country is required
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select State"
                  name="city_states_id"
                  control={control}
                  options={stateOptions}
                  isDisabled={!watchedCountryId}
                />
                {errors.city_states_id && (
                  <span className="text-red-500 text-sm mt-1 block">
                    State is required
                  </span>
                )}
              </div>
            </div>

            {/* Third Row - City */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select City"
                  name="pms_cities_id"
                  control={control}
                  options={cityOptions}
                  isDisabled={!watchedStateId}
                />
                {errors.pms_cities_id && (
                  <span className="text-red-500 text-sm mt-1 block">
                    City is required
                  </span>
                )}
              </div>
            </div>

            {/* Fourth Row - Active Status */}
            {/* <div className="flex items-center gap-3">
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
          title="Location Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Location Code</span>
            <span>
              {states.find((state) => state.id === viewId)?.location_code}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Location Name</span>
            <span>{states.find((state) => state.id === viewId)?.location}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Country</span>
            <span>
              {states.find((state) => state.id === viewId)?.country_name}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">State</span>
            <span>
              {states.find((state) => state.id === viewId)?.state_name}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">City</span>
            <span>
              {states.find((state) => state.id === viewId)?.city_name}
            </span>
          </div>
          {/* <div className="flex justify-between border-b py-2">
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
          </div> */}

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
