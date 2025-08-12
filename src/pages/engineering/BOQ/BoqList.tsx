import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { toast } from "react-hot-toast";
import {
  deleteServiceBoq,
  fetchServiceBoqs,
} from "../../../services/Engineering/serviceBoq";
import { ServiceBoq } from "../../../types/Engineering/boqService";
import DataTable from "../../../components/DataTable";

export default function BoqList() {
  const [serviceBoqs, setServiceBoqs] = useState<ServiceBoq[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServiceBoqs({ page, per_page: perPage, filters: { search } })
      .then((res) => {
        console.log("Full API response:", res);
        setServiceBoqs(res.service_boqs);
        // Handle both meta structure and direct structure
        const totalCount = res.meta?.total || (res as any).total_count || 0;
        console.log("Setting total count:", totalCount);
        setTotalCount(totalCount);
      })
      .catch((error) => {
        console.error("Failed to fetch service BOQs:", error);
        toast.error("Failed to load BOQs");
      });
  }, [page, perPage, search]);

  console.log("service_boqs", serviceBoqs);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this Service BOQ?")) {
      return;
    }

    try {
      await deleteServiceBoq(id);
      toast.success("Service BOQ deleted successfully");

      setServiceBoqs((prevBoqs) => prevBoqs.filter((boq) => boq.id !== id));
    } catch (error) {
      console.error("Failed to delete Service BOQ:", error);
      toast.error("Failed to delete Service BOQ");
    }
  };

  const columns: {
    header: string;
    accessor: keyof ServiceBoq;
    render?: (boq: ServiceBoq, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_boq, index) => index + 1 + (page - 1) * perPage,
    },
    {
      header: "Project",
      accessor: "project_id",
      render: (boq) => boq.project_name || boq.project?.formatted_name || "-",
    },
    {
      header: "Site",
      accessor: "subproject_id",
      render: (boq) =>
        boq.subproject_name || boq.subproject?.formatted_name || "-",
    },
    {
      header: "Wing",
      accessor: "wing_id",
      render: (boq) => boq.wing_name || boq.wing?.formatted_name || "-",
    },
    {
      header: "Level 1",
      accessor: "level_one_id",
      render: (boq) => boq.level_one?.name || "-",
    },
    // {
    //   header: "Level 2",
    //   accessor: "level_two_id",
    //   render: (boq) => boq.level_two?.name || "-",
    // },
    {
      header: "Activities",
      accessor: "boq_activities",
      render: (boq) => boq.boq_activities?.length || 0,
    },
    {
      header: "Created Date",
      accessor: "created_at",
      render: (boq) => new Date(boq.created_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (boq) => (
        <div className="flex p-2 border rounded gap-2">
          <Link to={`${boq.id}/edit`} className="underline" title="Edit">
            <MdEdit size={18} />
          </Link>
          <Link to={`${boq.id}/view`} className="underline" title="View">
            <IoMdEye size={18} />
          </Link>
          <span
            onClick={() => handleDelete(boq.id)}
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
        <h2 className="text-2xl font-bold">BOQ</h2>
      </div>
      <div className="w-full max-h-[80vh]">
        <DataTable<ServiceBoq>
          data={serviceBoqs}
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
              + Create BOQ
            </Link>
          }
        />
      </div>
    </div>
  );
}
