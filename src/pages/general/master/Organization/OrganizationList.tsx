import { useCallback, useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../../components/DataTable";
import type { Organization } from "../../../../types/General/organization";
import {
  deleteOrganizationById,
  getOrganization,
  updateStatusOrganization,
} from "../../../../services/General/organizationservices";

export default function Organization() {
  const [states, setStates] = useState<Organization[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadData = useCallback(() => {
    getOrganization({ page, per_page: perPage, search })
      .then((res) => {
        const organizations = res?.organizations || [];
        setStates(Array.isArray(organizations) ? organizations : []);
        setTotalCount(res.total_count || 0);
      })
      .catch((error) => {
        console.error("Error loading organizations:", error);
        toast.error("Failed to load organizations");
      });
  }, [page, perPage, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (orgId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      await updateStatusOrganization(orgId, { active: newStatus });
      setStates((prev) =>
        prev.map((org) =>
          org.id === orgId ? { ...org, active: newStatus } : org
        )
      );

      toast.success(`Organization ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error(`Failed to update status`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Want to delete organization?")) return;
    try {
      await deleteOrganizationById(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns: {
    header: string;
    accessor: keyof Organization;
    render?: (org: Organization, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_org, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Organization", accessor: "name" },
    { header: "Country", accessor: "country" },
    { header: "State", accessor: "state" },
    { header: "City", accessor: "city" },
    {
      header: "Logo",
      accessor: "logo",
      render: (logo) => (
        <img
          src={logo?.organization_logo?.document}
          alt="Organization Logo"
          className="w-28 h-20 object-cover rounded"
        />
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      render: (org) => (
        <div className="flex justify-center p-2 border rounded gap-2">
          <button
            onClick={() => navigate(`./${org.id}/edit`)}
            className="cursor-pointer underline"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => navigate(`./${org.id}/view`)}
            className="cursor-pointer underline"
            title="View"
          >
            <IoMdEye size={18} />
          </button>
          <button
            onClick={() => handleToggle(org.id, org.active ?? false)}
            className="cursor-pointer underline"
            title={org.active ? "Disable" : "Enable"}
          >
            {org.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => handleDelete(org.id)}
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
    <div className="p-4">
      <div className="rounded-md p-6 card ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Organization Master</h2>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<Organization>
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
                + Create Organization
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}
