import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { getGeneralDropdown } from "../../../../services/locationDropdown";
import { mapToOptions } from "../../../../utils";
import DataTable from "../../../../components/DataTable";
import type { Project } from "../../../../types/General/projects";
import {
  // deleteSiteById,
  getSite,
  updateStatusSite,
} from "../../../../services/General/siteService";
import type { Site } from "../../../../types/General/sites";

export default function SiteList() {
  const navigate = useNavigate();
  const [states, setStates] = useState<Site[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [dropDown, setDropDown] = useState<{
    locations?: { countries?: never[] };
  }>({});
  // React Hook Form setup

  const loadData = useCallback(() => {
    getSite({ page, per_page: perPage, search }).then((res) => {
      setStates(res.pms_sites || []);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("Sub-Project", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusSite(userId, { active: newStatus });

      setStates((prev) =>
        prev.map((state) =>
          state.id === userId ? { ...state, active: newStatus } : state
        )
      );

      toast.success(`Sub-Project ${newStatus ? "enabled" : "disabled"}`, {
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

  // const handelDelete = async (id: number) => {
  //   if (!window.confirm("Want to delete Sub-Project?")) return;
  //   try {
  //     await deleteSiteById(id);
  //     toast.success("Deleted successfully");
  //     loadData();
  //   } catch {
  //     toast.error("Failed To Delete");
  //   }
  // };

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete Sub-Project?")) return;
    try {
      await updateStatusSite(id, { deleted: true });
      toast.success("Deleted successfully", {
        style: {
          backgroundColor: "#fef2f2",
          color: "#991b1b",
          border: `1px solid "#991b1b"`,
        },
      });
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleEdit = (state: Site) => {
    navigate(`${state.id}/edit`);
  };

  const columns: {
    header: string;
    accessor: keyof Site;
    render?: (company: Site, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Sub-Project Name", accessor: "name" },
    { header: "Certifying Company", accessor: "company_name" },
    { header: "Project", accessor: "project" },
    {
      header: "Location",
      accessor: "location",
      render: (site) => {
        const add = site?.location as { address?: string } | undefined;
        if (!add) return "_";
        return `${add?.address || ""}`;
      },
    },
    // { header: "Location", accessor: "project_address",
    //     render: (project) => {
    //         const add = project.project_address;

    //         if (!add) return "-";
    //         return `${add.address || ""}, ${add.pms_city_id || ""}, ${add.pms_state_id || ""}`
    //     }
    //  },

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
            onClick={() => handleToggle(state.id, state.active ?? false)}
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
          <h2 className="text-2xl font-bold">Sub-Project Master</h2>
        </div>{" "}
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => navigate("create")}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create Sub-Project
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<Site>
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
    </div>
  );
}
