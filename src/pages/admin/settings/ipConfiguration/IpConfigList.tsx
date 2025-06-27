import { useEffect, useState } from "react";

import DataTable from "../../../../components/DataTable";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import IpConfigurationModal from "./IpConfig";
import type { IpConfig } from "../../../../types/ipConfig";
import {
  deleteIpName,
  getIpconfig,
  updateStatusIpconfig,
  createIpconfig,
  updateIpconfig,
} from "../../../../services/ipConfigurationServices";

export default function IpConfigIndex() {
  const [users, setUsers] = useState<IpConfig[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedConfig, setSelectedConfig] = useState<IpConfig | null>(null);

  // Fixed: Removed useCallback and simplified loadData
  const loadData = () => {
    getIpconfig({ page, per_page: perPage, search }).then((res) => {
      setUsers(res.ip_configuration || res.ip_configurations || []);
      setTotalCount(res.total_count || 0);
    });
  };

  // Fixed: Only depend on the actual values that should trigger a reload
  useEffect(() => {
    loadData();
  }, [page, perPage, search]);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to delete this configuration?")
    ) {
      return;
    }

    try {
      await deleteIpName(id);
      toast.success("Configuration deleted successfully");
      loadData(); // Reload data after delete
    } catch (error) {
      console.error("Failed to delete configuration:", error);
      toast.error("Failed to delete configuration");
    }
  };

  const handleSave = async (configData: any) => {
    try {
      if (modalMode === "create") {
        await createIpconfig(configData);
        toast.success("Configuration created successfully");
      } else if (modalMode === "edit" && selectedConfig) {
        await updateIpconfig(selectedConfig.id, configData);
        toast.success("Configuration updated successfully");
      }
      loadData(); // Reload data after save
      setIsModalOpen(false);
      setSelectedConfig(null);
    } catch (error) {
      console.error("Failed to save configuration:", error);
      toast.error("Failed to save configuration");
    }
  };

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusIpconfig(userId, { active: newStatus });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      toast.success(`Configuration ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update configuration status: ${error}`);
    }
  };

  const columns: {
    header: string;
    accessor: keyof IpConfig;
    render?: (user: IpConfig, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_user, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Protocol", accessor: "protocol" },
    { header: "Camera Name", accessor: "camera_name" },
    { header: "User Name", accessor: "user_name" },
    { header: "IP Address", accessor: "ip_address" },
    { header: "Site", accessor: "site" },
    {
      header: "Actions",
      accessor: "id",
      render: (user) => (
        <div className="flex p-2 border rounded gap-2">
          <span
            onClick={() => {
              setModalMode("edit");
              setSelectedConfig(user);
              setIsModalOpen(true);
            }}
            className="cursor-pointer"
            title="Edit"
          >
            <MdEdit size={18} />
          </span>
          <span
            onClick={() => {
              setModalMode("view");
              setSelectedConfig(user);
              setIsModalOpen(true);
            }}
            className="cursor-pointer"
            title="View"
          >
            <IoMdEye size={18} />
          </span>
          <span
            onClick={() => handleToggle(user.id, user.active)}
            className="cursor-pointer"
            title={user.active ? "Disable" : "Enable"}
          >
            {user.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </span>
          <span
            onClick={() => handleDelete(user.id)}
            className="cursor-pointer"
            title="Delete"
          >
            <MdDelete size={17} />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="border rounded-md p-6 bg-white">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">IP Configuration</h2>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => {
              setModalMode("create");
              setSelectedConfig(null);
              setIsModalOpen(true);
            }}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + New IP Configuration
          </button>
        </div>
      </div>

      <div className="overflow-x-auto w-full max-h-[80vh]">
        <DataTable<IpConfig>
          data={users}
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

      {isModalOpen && (
        <IpConfigurationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedConfig(null);
          }}
          onSave={handleSave}
          initialData={selectedConfig}
          mode={modalMode}
        />
      )}
    </div>
  );
}
