import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { toast } from "react-hot-toast";
import {
  getServiceIndent,
  StatusCount,
  fetchProjects,
} from "../../../services/Home/Engineering/serviceIndentService";
import { siApi } from "../../../services/Home/Engineering/siApi";
import { ServiceIndent } from "../../../types/Home/engineering/serviceIndent";
import { mapToOptions } from "../../../utils";
import { getDropdownData } from "../../../services/setupDropDownService";
import HomeDataTable from "../../../components/HomeListPage";
import {
  getProjectsData,
  getFilteredServiceIndents,
  type ProjectData,
} from "../../../services/projectFilterService";

export default function SiManagementList() {
  const navigate = useNavigate();
  const [states, setStates] = useState<ServiceIndent[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [projectsData, setProjectsData] = useState<ProjectData[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState("approved");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  // Form-like project data for dependent dropdowns (same as ServiceIndentForm)
  const [formProjectsData, setFormProjectsData] = useState<{
    projects: unknown[];
  } | null>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWing, setSelectedWing] = useState("");

  const [dropDown, setDropDown] = useState<{
    locations?: { countries?: never[] };
  }>({});

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filteredByFromStatus, setFilteredByFromStatus] = useState(false);

  // Load projects data for filters (both APIs)
  useEffect(() => {
    getProjectsData().then(setProjectsData);
    fetchFormProjectData();
  }, []);

  // Fetch projects data for form-like dropdowns (same as ServiceIndentForm)
  const fetchFormProjectData = async () => {
    try {
      const projectsData = await fetchProjects();
      setFormProjectsData(projectsData);
    } catch (error: unknown) {
      console.error("Error fetching form project data:", error);
    }
  };

  console.log("projectData", projectsData);

  // Load status counts
  const loadStatusCounts = useCallback(async () => {
    try {
      const response = await StatusCount();
      const data = response;
      setStatusCounts(data);
    } catch (error) {
      console.error("Error loading status counts:", error);
    }
  }, []);

  useEffect(() => {
    loadStatusCounts();
  }, [loadStatusCounts]);

  const loadData = useCallback(
    async (filters?: {
      projectId?: string;
      siteId?: string;
      wingId?: string;
    }) => {
      try {
        if (
          filters &&
          (filters.projectId || filters.siteId || filters.wingId)
        ) {
          // Use filtered API
          const res = await getFilteredServiceIndents({
            projectId: filters.projectId,
            siteId: filters.siteId,
            wingId: filters.wingId,
            page,
            perPage,
            search,
          });
          setStates(res.service_boqs || []);
          setTotalCount(res.total_count);
        } else {
          // Use original API with status filter if active
          const apiParams: {
            page: number;
            per_page: number;
            search: string;
            status?: string;
          } = {
            page,
            per_page: perPage,
            search,
          };

          // Add status filter if not "all"
          if (activeStatusFilter !== "all") {
            apiParams.status = activeStatusFilter;
          }

          const res = await getServiceIndent(apiParams);
          setStates(res.service_boqs || []);
          setTotalCount(res.total_count);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
    [page, perPage, search, activeStatusFilter]
  );

  // Load data filtered by status
  const loadDataByStatus = useCallback(
    async (status: string) => {
      try {
        console.log(`Loading data for status: ${status}`);
        const res = await getServiceIndent({
          page: 1, // Reset to first page when filtering by status
          per_page: perPage,
          search,
          status: status,
        });
        setStates(res.service_boqs || []);
        setTotalCount(res.total_count);
        setPage(1); // Reset page to 1 when filtering
      } catch (error) {
        console.error("Error loading data by status:", error);
      }
    },
    [perPage, search]
  );

  console.log("Sub-Project", states);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Bulk action handlers
  const handleRowSelect = useCallback((id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = states.map((state) => state.id);
        setSelectedIds(allIds);
      } else {
        setSelectedIds([]);
      }
    },
    [states]
  );

  const handleBulkFilter = useCallback(
    (fromStatus: string) => {
      console.log("Filtering by status:", fromStatus);

      // Prevent unnecessary state updates if the status hasn't changed
      if (fromStatus) {
        setFilteredByFromStatus(true);
        setSelectedIds([]); // Clear selections when filtering
        loadDataByStatus(fromStatus);
      } else {
        setFilteredByFromStatus(false);
        setSelectedIds([]); // Clear selections when clearing filter
        loadData(); // Load all data if no filter
      }
    },
    [loadDataByStatus, loadData]
  );

  const handleBulkSubmit = useCallback(
    async (
      fromStatus: string,
      toStatus: string,
      comment: string,
      selectedIds: number[]
    ) => {
      try {
        console.log("Bulk update:", {
          fromStatus,
          toStatus,
          comment,
          selectedIds,
        });

        // Update status for all selected items
        const updatePromises = selectedIds.map((id) =>
          siApi.updateStatus(id, {
            status: toStatus,
            remarks: comment,
            comments: comment,
          })
        );

        await Promise.all(updatePromises);

        // Show success message
        toast.success(
          `Successfully updated ${selectedIds.length} items from ${fromStatus} to ${toStatus}`
        );

        // Clear selections and reload data
        setSelectedIds([]);
        if (filteredByFromStatus) {
          loadDataByStatus(fromStatus); // Reload filtered data
        } else {
          loadData(); // Reload all data
        }
        loadStatusCounts(); // Refresh status counts
      } catch (error) {
        console.error("Error in bulk update:", error);
        toast.error("Failed to update items. Please try again.");
      }
    },
    [filteredByFromStatus, loadDataByStatus, loadData, loadStatusCounts]
  );

  // Status card data based on the API status counts - Dynamic generation
  //   const statusCards = [
  //     // Always show total/SI List first
  //     {
  //       label: "SI List",
  //       count: statusCounts.total || totalCount,
  //       isActive: activeStatusFilter === "all",
  //       onClick: () => {
  //         console.log("Clicked SI List - loading all data");
  //         setActiveStatusFilter("all");
  //         // Load all data without status filter
  //         const loadAllData = async () => {
  //           try {
  //             const res = await getServiceIndent({
  //               page: 1,
  //               per_page: perPage,
  //               search,
  //             });
  //             setStates(res.service_boqs || []);
  //             setTotalCount(res.total_count);
  //             setPage(1);
  //           } catch (error) {
  //             console.error("Error loading all data:", error);
  //           }
  //         };
  //         loadAllData();
  //       },
  //     },
  //     ...Object.entries(statusCounts)
  //       .filter(([key]) => key !== "total")
  //       .map(([key, count]) => {
  //         // Map API keys to display labels
  //         const labelMap: Record<string, string> = {
  //           draft: "Draft",
  //           app_pending: "Pending",
  //           open: "Open",
  //           approved: "Approved",
  //           rejected: "Rejected",
  //           cancelled: "Cancelled",
  //           accepted: "Accepted",
  //           sent_for_mto: "Sent for MTO",
  //         };

  //         return {
  //           label: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
  //           count: count,
  //           isActive: activeStatusFilter === key,
  //           onClick: () => {
  //             console.log(`Clicked ${key} status card - filtering data`);
  //             setActiveStatusFilter(key);
  //             // Filter by specific status
  //             loadDataByStatus(key);
  //           },
  //         };
  //       }),
  //   ];

  const statusCards = [
    // SI List - shows all data
    {
      label: "SI List",
      count: statusCounts.total || totalCount,
      isActive: activeStatusFilter === "all",
      onClick: () => {
        console.log("Clicked SI List - loading all data");
        setActiveStatusFilter("all");
        // Load all data without status filter
        const loadAllData = async () => {
          try {
            const res = await getServiceIndent({
              page: 1,
              per_page: perPage,
              search,
            });
            setStates(res.service_boqs || []);
            setTotalCount(res.total_count);
            setPage(1);
          } catch (error) {
            console.error("Error loading all data:", error);
          }
        };
        loadAllData();
      },
    },
    // Received for Approval (submitted status) - Default selected
    {
      label: "Submitted",
      count: statusCounts.submitted || 0,
      isActive: activeStatusFilter === "submitted",
      onClick: () => {
        console.log(
          "Clicked Received for Approval - filtering by submitted status"
        );
        setActiveStatusFilter("submitted");
        loadDataByStatus("submitted");
      },
    },
    // Approved
    {
      label: "Approved SI",
      count: statusCounts.approved || 0,
      isActive: activeStatusFilter === "approved",
      onClick: () => {
        console.log("Clicked Approved - filtering by approved status");
        setActiveStatusFilter("approved");
        loadDataByStatus("approved");
      },
    },
    // Rejected
    {
      label: "Rejected",
      count: statusCounts.rejected || 0,
      isActive: activeStatusFilter === "rejected",
      onClick: () => {
        console.log("Clicked Rejected - filtering by rejected status");
        setActiveStatusFilter("rejected");
        loadDataByStatus("rejected");
      },
    },
    // Send to MTO
    {
      label: "Accepted",
      count: statusCounts.sent_for_mto || 0,
      isActive: activeStatusFilter === "accepted",
      onClick: () => {
        console.log("Clicked Send to MTO - filtering by sent_for_mto status");
        setActiveStatusFilter("sent_for_mto");
        loadDataByStatus("sent_for_mto");
      },
    },
  ];

  // Dynamic options based on API data (same as ServiceIndentForm)
  const projectOptions = useMemo(() => {
    const options = (formProjectsData?.projects || []).map((p: unknown) => ({
      value: (p as { id: number }).id.toString(),
      label: (p as { formatted_name: string }).formatted_name,
    }));
    return options;
  }, [formProjectsData]);

  const siteOptions = useMemo(() => {
    if (!selectedProject) return [];
    const project = (formProjectsData?.projects || []).find(
      (p: unknown) => (p as { id: number }).id === parseInt(selectedProject)
    );
    const options = (
      (project as { pms_sites?: unknown[] })?.pms_sites || []
    ).map((s: unknown) => ({
      value: (s as { id: number }).id.toString(),
      label: (s as { name: string }).name,
    }));
    return options;
  }, [formProjectsData, selectedProject]);

  const wingOptions = useMemo(() => {
    if (!selectedProject || !selectedSite) return [];
    const project = (formProjectsData?.projects || []).find(
      (p: unknown) => (p as { id: number }).id === parseInt(selectedProject)
    );
    const site = ((project as { pms_sites?: unknown[] })?.pms_sites || []).find(
      (s: unknown) => (s as { id: number }).id === parseInt(selectedSite)
    );
    const options = ((site as { pms_wings?: unknown[] })?.pms_wings || []).map(
      (w: unknown) => ({
        value: (w as { id: number }).id.toString(),
        label: (w as { name: string }).name,
      })
    );
    return options;
  }, [formProjectsData, selectedProject, selectedSite]);

  // Quick filter options using dynamic dropdowns
  const quickFilters = [
    {
      label: "Project",
      value: "project",
      options: projectOptions,
      onChange: (value: string) => {
        setSelectedProject(value);
        // Reset dependent fields
        setSelectedSite("");
        setSelectedWing("");
      },
    },
    {
      label: "Sub-Project",
      value: "subProject",
      options: siteOptions,
      onChange: (value: string) => {
        setSelectedSite(value);
        // Reset dependent field
        setSelectedWing("");
      },
    },
    {
      label: "Wing",
      value: "wing",
      options: wingOptions,
      onChange: (value: string) => {
        setSelectedWing(value);
      },
    },
  ];

  const bulkActions = {
    label: "Bulk Action",
    options: [
      { label: "Draft", value: "draft" },
      { label: "Submitted", value: "submitted" },
      { label: "Approved", value: "approved" },
      { label: "Rejected", value: "rejected" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Accepted", value: "accepted" },
    ],
    onAction: (action: string, selectedIds: number[]) => {
      console.log("Bulk action:", action, "for IDs:", selectedIds);
      // Implement bulk action logic here
    },
    onSubmit: handleBulkSubmit,
  };

  // Handle quick filter apply
  const handleQuickFilterApply = (filters: Record<string, string>) => {
    console.log("Applied filters:", filters);

    // Update state variables to sync with form values
    if (filters.project !== selectedProject) {
      setSelectedProject(filters.project || "");
    }
    if (filters.subProject !== selectedSite) {
      setSelectedSite(filters.subProject || "");
    }
    if (filters.wing !== selectedWing) {
      setSelectedWing(filters.wing || "");
    }

    // Apply filters to data loading
    loadData({
      projectId: filters.project,
      siteId: filters.subProject,
      wingId: filters.wing,
    });
  };

  // Handle SI Code click based on status
  const handleSICodeClick = (serviceIndent: ServiceIndent) => {
    const status = serviceIndent.status?.toLowerCase();

    switch (status) {
      case "accepted":
      case "in_progress":
      case "completed":
        // Navigate to management page for these statuses
        navigate(`${serviceIndent.id}/manage`);
        break;
      case "draft":
        // Navigate to edit page for draft status
        navigate(`${serviceIndent.id}/edit`);
        break;
      case "submitted":
      case "site_approved":
        // Navigate to approval page for submitted and site approved status
        navigate(`${serviceIndent.id}/approval`);
        break;
      case "estimation_approved":
        // Navigate to management page for estimation approved status
        navigate(`${serviceIndent.id}/manage`);
        break;
      default:
        // For all other statuses (rejected, cancelled, etc.), navigate to details/view page
        navigate(`${serviceIndent.id}/manage`);
        break;
    }
  };

  // Get status color for visual indication
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  //   const handleToggle = async (userId: number, currentStatus: boolean) => {
  //     const newStatus = !currentStatus;

  //     try {
  //       await updateStatusSite(userId, { active: newStatus });

  //       setStates((prev) =>
  //         prev.map((state) =>
  //           state.id === userId ? { ...state, active: newStatus } : state
  //         )
  //       );

  //       toast.success(`Sub-Project ${newStatus ? "enabled" : "disabled"}`, {
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
    getDropdownData().then(setDropDown);
  }, []);

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

  //   const handelDelete = async (id: number) => {
  //     if (!window.confirm("Want to delete Sub-Project?")) return;
  //     try {
  //       await updateStatusSite(id, { deleted: true });
  //       toast.success("Deleted successfully", {
  //         style: {
  //           backgroundColor: "#fef2f2",
  //           color: "#991b1b",
  //           border: `1px solid "#991b1b"`,
  //         },
  //       });
  //       loadData();
  //     } catch {
  //       toast.error("Failed To Delete");
  //     }
  //   };

  const columns: {
    header: string;
    accessor: keyof ServiceIndent;
    render?: (company: ServiceIndent, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_state, index) => (page - 1) * perPage + index + 1,
    },
    {
      header: "SI Number",
      accessor: "si_code",
      render: (state) => (
        <button
          onClick={() => handleSICodeClick(state)}
          className="text-red-700 hover:text-red-800 underline cursor-pointer"
          title="Click to view details"
        >
          {state.si_code}
        </button>
      ),
    },
    { header: "Project", accessor: "project_name" },
    { header: "Sub-Project", accessor: "site_name" },
    {
      header: "Work Category",
      accessor: "si_work_categories",
      render: (state) => {
        if (state.si_work_categories && state.si_work_categories.length > 0) {
          return state.si_work_categories
            .map((cat) => cat.level_one_name)
            .join(", ");
        }
        return "-";
      },
    },
    {
      header: "Work Sub-Category",
      accessor: "si_work_categories",
      render: (state) => {
        if (state.si_work_categories && state.si_work_categories.length > 0) {
          return state.si_work_categories
            .map((cat) => cat.level_two_name)
            .join(", ");
        }
        return "-";
      },
    },
    { header: "Service Indent Date", accessor: "si_date" },
    {
      header: "Status",
      accessor: "status",
      render: (state) => (
        <span
          style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            padding: "10px 1rem",
            fontStyle: "normal",
            fontSize: "13px",
          }}
        >
          {state.status?.charAt(0).toUpperCase() + state?.status?.slice(1)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (state) => (
        <div className="flex justify-center p-2 border rounded gap-2">
          <button
            onClick={() => navigate(`${state.id}/edit`)}
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
          {/* <button
            onClick={() => handleToggle(state.id, state.active ?? false)}
            className="cursor-pointer underline"
            title={state.active ? "Disable" : "Enable"}
          >
            {state.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button> */}
          {/* <button
            onClick={() => handelDelete(state.id)}
            className="cursor-pointer underline"
            title="Delete"
          >
            <MdDelete size={17} />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <div className="module-data-section p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Service Indent</h2>
      </div>
      <div className="overflow-x-auto w-full max-h-[80vh] p-2">
        <HomeDataTable<ServiceIndent>
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
          statusCards={statusCards}
          quickFilters={quickFilters}
          bulkActions={bulkActions}
          onQuickFilterApply={handleQuickFilterApply}
          // Bulk selection props
          showBulkSelection={filteredByFromStatus}
          selectedIds={selectedIds}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          onBulkFilter={handleBulkFilter}
          //   actionSlot={
          //     <button
          //       onClick={() => navigate("create")}
          //       className="bg-red-800 text-white px-4 py-2 rounded-md"
          //     >
          //       + Create Service Indent
          //     </button>
          //   }
        />
      </div>
    </div>
  );
}
