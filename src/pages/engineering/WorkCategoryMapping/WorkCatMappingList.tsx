import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { toast } from "react-hot-toast";
import DataTable from "../../../components/DataTable";
import { MappingResponse } from "../../../types/Engineering/activityMapping";
import { getMapping, deleteActivity } from "../../../services/Engineering/serviceCatMapping";

export default function WorkCategoryMappingList() {
  const [mappings, setMappings] = useState<MappingResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMapping({ page, per_page: perPage, search })
      .then((res) => {
        console.log("Full API response:", res);
        setMappings(res.activity_category_mappings || []);
        // Handle both meta structure and direct structure
        const totalCount = res.total_count || 0;
        console.log("Setting total count:", totalCount);
        setTotalCount(totalCount);
      })
      .catch((error) => {
        console.error("Failed to fetch activity category mappings:", error);
        toast.error("Failed to load activity mappings");
      });
  }, [page, perPage, search]);

  console.log("activity_category_mappings", mappings);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this Activity Mapping?")) {
      return;
    }

    try {
      await deleteActivity(id);
      toast.success("Activity Mapping deleted successfully");

      setMappings((prevMappings) => prevMappings.filter((mapping) => mapping.id !== id));
    } catch (error) {
      console.error("Failed to delete Activity Mapping:", error);
      toast.error("Failed to delete Activity Mapping");
    }
  };

  const columns: {
    header: string;
    accessor: keyof MappingResponse;
    render?: (mapping: MappingResponse, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_mapping, index) => index + 1 + (page - 1) * perPage,
    },
    {
      header: "Main Category (Level 1)",
      accessor: "level_one_id",
      render: (mapping) => mapping.level_one?.name || "-",
    },
    {
      header: "Sub Category Level 2",
      accessor: "level_two_id",
      render: (mapping) => mapping.level_two?.name || "-",
    },
    {
      header: "Sub Category Level 3",
      accessor: "level_three_id",
      render: (mapping) => mapping.level_three?.name || "-",
    },
    {
      header: "Sub Category Level 4",
      accessor: "level_four_id",
      render: (mapping) => mapping.level_four?.name || "-",
    },
    {
      header: "Sub Category Level 5",
      accessor: "level_five_id",
      render: (mapping) => mapping.level_five?.name || "-",
    },
    {
      header: "Activities Count",
      accessor: "labour_activity_category_mappings",
      render: (mapping) => mapping.labour_activity_category_mappings?.length || 0,
    },
    {
      header: "Actions",
      accessor: "id",
      render: (mapping) => (
        <div className="flex p-2 border rounded gap-2">
          <Link to={`${mapping.id}/edit`} className="underline" title="Edit">
            <MdEdit size={18} />
          </Link>
          <Link to={`${mapping.id}/view`} className="underline" title="View">
            <IoMdEye size={18} />
          </Link>
          <span
            onClick={() => handleDelete(mapping.id)}
            className="cursor-pointer underline text-red-600 hover:text-red-800"
            title="Delete"
          >
            <MdDelete size={17} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="border rounded-md card bg-white">
      <div className="flex p-3 justify-between">
        <h2 className="text-2xl font-bold">Activity Mapping</h2>
      </div>
      <div className="w-full max-h-[80vh]">
        <DataTable<MappingResponse>
          data={mappings}
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
            <Link
              to="create"
              className="bg-red-800 text-white px-4 py-2 rounded-md"
            >
              + Create Activity Mapping
            </Link>
          }
        />
      </div>
    </div>
  );
}
