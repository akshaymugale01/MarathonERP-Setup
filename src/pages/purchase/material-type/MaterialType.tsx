import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import {
  getMaterialType,
  updateMaterialType,
} from "../../../services/Purchase/materialType";
import { getGeneralDropdown } from "../../../services/locationDropdown";
import { mapToOptions } from "../../../utils";
import type { MaterialType } from "../../../types/Purchase/material_type";
import DataTable from "../../../components/DataTable";

export default function MaterialTypeList() {
  const navigate = useNavigate();
  const [states, setStates] = useState<MaterialType[]>([]);
  console.log("states", states);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dropDown, setDropDown] = useState<{
    locations?: { countries?: never[] };
  }>({});

  const loadData = useCallback(() => {
    getMaterialType({ page, per_page: perPage, search }).then((res) => {
      setStates(res.inventory_types || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("Floor", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateMaterialType(userId, { active: newStatus });

      setStates((prev) =>
        prev.map((state) =>
          state.id === userId ? { ...state, active: newStatus } : state
        )
      );

      toast.success(`Floor ${newStatus ? "enabled" : "disabled"}`, {
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
      await updateMaterialType(id, { deleted: true });
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleEdit = (state: MaterialType) => {
    navigate(`${state.id}/edit`);
  };

  const columns: {
    header: string;
    accessor: keyof MaterialType;
    render?: (Floor: MaterialType, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Company", accessor: "company" },
    { header: "Project", accessor: "project" },
    { header: "Sub-Project", accessor: "site" },
    { header: "Wing", accessor: "wing" },
    { header: "Floor", accessor: "name" },
    {
      header: "No Of Floors",
      accessor: "no_of_units",
    },
    { header: "Total Area", accessor: "total_area" },
    {
      header: "Unit Mix",
      accessor: "unit_mix",
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
          <h2 className="text-2xl font-bold">Floor Master</h2>
        </div>{" "}
        <div className="flex justify-end items-center mb-4"></div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<MaterialType>
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
                onClick={() => navigate("create")}
                className="bg-red-800 text-white px-4 py-2 rounded-md"
              >
                + Create Floor
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
