import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { toast } from "react-hot-toast";
import { ServiceDescription } from "../../types/Engineering/serviceDescription";
import {
  createserviceDescription,
  deleteServiceDesc,
  fetchActivityList,
  getserviceDescriptions,
  updateStatusserviceDescription,
} from "../../services/Engineering/serviceDescription";
import { getGeneralDropdown } from "../../services/locationDropdown";
import { mapToOptions } from "../../utils";
import DataTable from "../../components/DataTable";
import GeneralMasterModal from "../../components/forms/GeneralMasterModal";
import SelectBox from "../../components/forms/SelectBox";
import { fetchActivities } from "../../services/Engineering/serviceBoq";

export default function ServiceDescriptions() {
  const [states, setStates] = useState<ServiceDescription[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingState, setEditingState] = useState<ServiceDescription | null>(
    null
  );
  const [dropDown, setDropDown] = useState<{
    locations?: any;
    labour_activities?: any[];
  }>({});
  // React Hook Form setup
  const { register, handleSubmit, reset, control } =
    useForm<ServiceDescription>();

  const loadData = useCallback(() => {
    getserviceDescriptions({ page, per_page: perPage, search }).then((res) => {
      setStates(res.descriptions || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("states", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  //   const handleToggle = async (userId: number, currentStatus: boolean) => {
  //     const newStatus = !currentStatus;

  //     try {
  //       await updateStatusserviceDescription(userId, { active: newStatus });

  //       setStates((prev) =>
  //         prev.map((state) =>
  //           state.id === userId ? { ...state, active: newStatus } : state
  //         )
  //       );

  //       toast.success(`State ${newStatus ? "enabled" : "disabled"}`, {
  //         style: {
  //           backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
  //           color: newStatus ? "#16a34a" : "#991b1b",
  //           border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
  //         },
  //       });
  //     } catch (error) {
  //       toast.error(`Failed to update state status: ${error}`);
  //     }
  //   };

  useEffect(() => {
    fetchActivityList().then((data) => {
      console.log("Raw activities response:", data.labour_activities);
      setDropDown({ labour_activities: data.labour_activities });
    });
  }, []);

  console.log("dropdown data", dropDown);

  const stateOptions = mapToOptions(dropDown.labour_activities || []);
  console.log("stateOptions", stateOptions);

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete state?")) return;
    try {
      await deleteServiceDesc(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingState(null);
    reset({
      name: "",
      text: "",
      resource_id: 0,
      resource_type: "LabourActivity",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (state: ServiceDescription) => {
    setEditingState(state);
    reset({
      name: state.name,
      text: state.text,
      resource_id: state.resource_id,
      resource_type: state.resource_type,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ServiceDescription) => {
    console.log("Form submission data:", data);
    try {
      if (editingState?.id) {
        // Update existing state
        console.log("Updating description:", editingState.id, data);
        await updateStatusserviceDescription(editingState.id, data);
        toast.success("State updated successfully");
      } else {
        // Create new state
        console.log("Creating new description:", data);
        await createserviceDescription(data);
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
    accessor: keyof ServiceDescription;
    render?: (user: ServiceDescription, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "text" },
    { header: "Resource Type", accessor: "resource_name" },

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
          {/* <button
            onClick={() => handleToggle(state.id, state.active)}
            className="cursor-pointer underline"
            title={state.active ? "Disable" : "Enable"}
          >
            {state.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button> */}
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
          <h2 className="text-2xl font-bold">Descriptions</h2>
        </div>
        <div className="flex justify-end items-center mb-4"></div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<ServiceDescription>
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
            actionSlot={
              <button
                onClick={handleCreate}
                className="bg-red-800 text-white px-4 py-2 rounded-md"
              >
                + Create Description
              </button>
            }
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <GeneralMasterModal
          title={editingState ? "Edit Description" : "Create Description"}
          onClose={handleModalClose}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden field for resource_type */}
            <input
              type="hidden"
              {...register("resource_type")}
              value="LabourActivity"
            />
            {/* First Row - State Code and State Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="border p-3 rounded w-full uppercase border-gray-300"
                  placeholder="Please input name"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("text")}
                  className="border p-3 rounded w-full border-gray-300"
                  placeholder="Enter Description"
                />
              </div>
            </div>

            {/* Second Row - Country ID and TIN Number */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Labour Activity <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select Labour Activity"
                  name="resource_id"
                  control={control}
                  options={stateOptions}
                />
              </div>
              {/* <div>
                <label className="block mb-2 font-medium">TIN Number</label>
                <input
                  type="text"
                  {...register("tin_number")}
                  className="border p-3 rounded w-full border-gray-300"
                  placeholder="Enter TIN number"
                />
              </div> */}
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
          title="Description Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Name</span>
            <span>{states.find((state) => state.id === viewId)?.name}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Description</span>
            <span>{states.find((state) => state.id === viewId)?.text}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Resource ID</span>
            <span>
              {states.find((state) => state.id === viewId)?.resource_id}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Resource </span>
            <span>
              {states.find((state) => state.id === viewId)?.resource_name}
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
