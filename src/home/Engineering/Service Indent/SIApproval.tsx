import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { siApi } from "../../../services/Home/Engineering/siApi";
import { getServiceIndentById } from "../../../services/Home/Engineering/serviceIndentService";
import { ServiceIndent } from "../../../types/Home/engineering/serviceIndent";
import { useForm } from "react-hook-form";
import SelectBox from "../../../components/forms/SelectBox";

const SIDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { control, setValue, watch } = useForm({
    defaultValues: {
      status: "draft",
    },
  });
  const navigate = useNavigate();
  const [siData, setSiData] = useState<ServiceIndent>(null);
  console.log("SI data", siData);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("draft");
  const [newComment, setNewComment] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [currentUserApproved, setCurrentUserApproved] = useState(false);

  const watchedStatus = watch("status");

  // Debug: Check current status values
  console.log("Current status data:", {
    watchedStatus,
    selectedStatus,
    serviceIndentStatus: siData?.status,
    formDefaultStatus: "draft",
  });

  const fetchSIData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServiceIndentById(id);
      setSiData(response);
      
      // Check if current user has already approved this SI
      const hasUserApproved = response.invoice_approval_histories?.some(
        (history: {approve?: boolean; updated_by_name?: string}) => 
          history.approve === true && history.updated_by_name
      );
      setCurrentUserApproved(hasUserApproved || false);
      
      // If user has approved or SI is fully approved, set form to approved
      const currentStatus = hasUserApproved || response.status === "approved" 
        ? "approved" 
        : (response.status || "draft");
      setSelectedStatus(currentStatus);
      setValue("status", currentStatus);
    } catch (error) {
      console.error("Error fetching SI data:", error);
      toast.error("Failed to fetch SI data");
    } finally {
      setLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    if (id) {
      fetchSIData();
    }
  }, [id, fetchSIData]);

  // Update selectedStatus when form status changes
  useEffect(() => {
    if (watchedStatus) {
      setSelectedStatus(watchedStatus);
    }
  }, [watchedStatus]);

  // Ensure form status is set when siData changes
  useEffect(() => {
    if (siData?.status) {
      // Check if current user has already approved
      const hasUserApproved = siData.invoice_approval_histories?.some(
        (history: {approve?: boolean; updated_by_name?: string}) => 
          history.approve === true && history.updated_by_name
      );
      
      // If user has approved or SI is fully approved, set form to approved
      const formStatus = hasUserApproved || siData.status === "approved" 
        ? "approved" 
        : siData.status;
      setValue("status", formStatus);
      setSelectedStatus(formStatus);
      setCurrentUserApproved(hasUserApproved || false);
    }
  }, [siData, setValue]);

  const handleStatusUpdate = async () => {
    try {
      // Use watchedStatus as the primary source of truth (same as SIDetails)
      const currentStatus = watchedStatus;
      const commentToSend = newComment;

      if (!currentStatus) {
        toast.error("Please select a status");
        return;
      }

      // For approval workflow, always use si_approval type
      await siApi.updateStatus(Number(id), {
        status: currentStatus,
        type: "si_approval",
        remarks: commentToSend || `Status updated to ${currentStatus}`,
        comments:
          commentToSend || `Service Indent status updated to ${currentStatus}`,
      });

      // Check if all required approvers have approved before updating main status
      if (currentStatus === "approved") {
        try {
          const approvalStatus = await siApi.checkApprovalStatus(Number(id));
          if (approvalStatus.all_approved) {
            toast.success(
              "SI approved by all required approvers and status updated"
            );
          } else {
            toast.success(
              `Your approval recorded. Pending approvals: ${
                approvalStatus.pending_approvers?.join(", ") || "Others"
              }`
            );
          }
        } catch (approvalError) {
          console.log(
            "Approval status check not available, proceeding with standard flow",
            approvalError
          );
          toast.success("Status updated successfully");
        }
      } else {
        toast.success("Status updated successfully");
      }

      // Add a small delay before refreshing to ensure backend is updated
      setTimeout(async () => {
        await fetchSIData();
      }, 500);

      setNewComment("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!siData) {
    return <div className="p-6">SI not found</div>;
  }

  // Approval status options - for approval workflow
  const approvalStatusOptions = [
    { label: "Submitted", value: "submitted" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  const workOrderTypes = {
    new_si: "New",
    variation: "Variation",
    amendment: "Amendment",
    variation_and_amendment: "Variation and Amendment",
  };

  return (
    <div className="tab-content mor-content active ">
      <div className="tab-pane fade show active">
        <div className="container-fluid">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">SI Details</h1>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                currentUserApproved || siData?.status === "approved"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-700 hover:bg-red-800 text-white"
              }`}
              onClick={() => setShowApprovalModal(true)}
            >
              Approval Logs
            </button>
          </div>

          {/* Main Details Grid */}
          <div className="row mb-6">
            <div className="details_page">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Type Of Work Order
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {workOrderTypes[siData.type_of_work_order] || ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Project Name
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.project_name || ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">Sub-Project</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.site_name || ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">Wing</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.wing_name || ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">Is Wbs</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.wbs ? "Yes" : "No"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Type of Contract{" "}
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.type_of_contract || ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Floor Selection
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.si_floors.map((ak) => ak.floor_name).join(",") ||
                      ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Work Urgency
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.work_urgency ? "Yes" : "No"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Reason Of Urgency
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.reason_for_urgency || ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Urgency Status
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">{""}</span>
                </div>
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Reason Of Urgency
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.reason || ""}
                  </span>
                </div>
                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">Remark</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.remark}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Requested Deparment
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">{""}</span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">SI Date</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.si_date || "null"}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Requested By
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.requistioner_name || ""}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">Department</span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.department_name}
                  </span>
                </div>

                <div className="grid grid-cols-3 items-center px-3">
                  <span className="font-medium text-gray-700">
                    Work Description
                  </span>
                  <span className="text-center">:</span>
                  <span className="text-red-700 font-medium">
                    {siData.work_description || ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <span className="font-bold">Boq Activity & Service</span>

            {/* Display separate table for each work category */}
            {siData.si_work_categories?.map((category, catIndex) => {
              const categoryLevels = [
                category.level_one_name,
                category.level_two_name,
                category.level_three_name,
                category.level_four_name,
                category.level_five_name,
              ].filter(Boolean);

              return (
                <div key={category.id} className="mb-6">
                  {/* Work Category Header */}
                  <div className="bg-gray-100 p-3 rounded-t-lg border-l-4 border-red-800">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Work Category {catIndex + 1}: {categoryLevels.join(" - ")}
                    </h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="mr-4">
                        Start Date: {category.planned_date_start_work}
                      </span>
                      <span>End Date: {category.planned_finish_date}</span>
                    </div>
                  </div>

                  {/* BOQ Activities Table for this work category */}
                  <div className="tbl-container me-2">
                    <table className="w-100" style={{ width: "100%" }}>
                      <thead className="bg-red-800 text-white">
                        <tr>
                          <th>Sr.No</th>
                          <th>
                            <input
                              className="ml-1"
                              type="checkbox"
                              disabled
                            ></input>
                          </th>
                          <th>Name</th>
                          <th>Unit</th>
                          <th>Estimated Qty</th>
                          <th>Required Qty</th>
                          <th>Balanced Qty</th>
                          <th>Executed SI Qty</th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {category.si_boq_activities?.map(
                          (activity, actIndex) => (
                            <React.Fragment
                              key={activity.id || `new-${actIndex}`}
                            >
                              {/* Activity Row */}
                              <tr
                                className={
                                  actIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }
                              >
                                <td className="px-4 py-3 text-sm font-medium">
                                  {actIndex + 1}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    disabled
                                  />
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    <span className="mr-2 text-red-600">▼</span>
                                    <span className="font-medium">
                                      {activity.boq_activity_name ||
                                        "Name can't be blank !!"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-center"></td>
                                <td className="px-4 py-3 text-sm text-right"></td>
                                <td className="px-4 py-3 text-sm text-right"></td>
                                <td className="px-4 py-3 text-sm text-right"></td>
                                <td className="px-4 py-3 text-sm text-right"></td>
                              </tr>

                              {/* Services under Activity */}
                              {activity.si_boq_activity_services?.map(
                                (service, servIndex) => (
                                  <tr
                                    key={
                                      service.id || `new-service-${servIndex}`
                                    }
                                    className="bg-green-50"
                                  >
                                    <td className="px-4 py-3 text-sm">
                                      {actIndex + 1}.{servIndex + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                        defaultChecked
                                      />
                                    </td>
                                    <td className="px-4 py-3 text-sm pl-8">
                                      <div className="space-y-1">
                                        <div className="font-medium">
                                          {service.service_name}
                                        </div>
                                        <div className="text-xs text-green-600">
                                          Qty:{" "}
                                          <span className="font-medium">
                                            {service.required_qty}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                      Sq.feet
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      {""}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <div className="flex items-center justify-end">
                                        <input
                                          type=""
                                          value={service.required_qty}
                                          className="px-2 py-1 border border-gray-300 rounded text-sm text-right"
                                          onChange={(e) => {
                                            service.required_qty =
                                              e.target.value;
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      {""}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-right">
                                      {""}
                                    </td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

              {/* Attachments Section */}
          <div className="mb-8">
            {/* Vendor Attachments */}
            <div className="bg-white rounded-lg shadow-lg mb-4">
              <div className="flex">
                <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl flex justify-between items-center w-full">
                  <h3 className="text-lg font-medium text-white">
                    Share with Vendor/Contractor
                  </h3>
                </div>
              </div>
              <div className="p-6">
                {!siData.vendor_attachments || siData.vendor_attachments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No vendor attachments added yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-red-800">
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "120px" }}>
                            File Type
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "250px" }}>
                            File Name
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "120px" }}>
                            Upload At
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "300px" }}>
                            File
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {siData.vendor_attachments.map((attachment) => (
                          <tr key={attachment.id} className="border-b">
                            <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                              <div className="text-gray-700 font-medium text-sm truncate" title={attachment.content_type || "File Type"}>
                                {attachment.content_type || "File Type"}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="text-gray-700 text-sm" title={attachment.filename}>
                                {attachment.filename}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                              <div className="text-gray-700 text-sm text-center" title={attachment.created_at}>
                                {new Date(attachment.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex items-center gap-2">
                                {attachment.url || attachment.doc_path ? (
                                  <div className="flex items-center gap-2 w-full">
                                    {attachment.content_type?.startsWith("image/") ? (
                                      <div className="flex items-center gap-2">
                                        <div className="group relative flex-shrink-0">
                                          <img
                                            src={attachment.url || attachment.doc_path}
                                            alt={attachment.filename}
                                            className="w-10 h-10 object-cover rounded border cursor-pointer hover:opacity-75"
                                            onClick={() => window.open(attachment.url || attachment.doc_path, "_blank")}
                                            title="Click to view full image"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm text-gray-700 truncate" title={attachment.filename}>
                                            {attachment.filename}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 w-full">
                                        <div className="group relative flex-shrink-0">
                                          <div
                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors text-xs whitespace-nowrap"
                                            onClick={() => window.open(attachment.url || attachment.doc_path, "_blank")}
                                            title="Click to download file"
                                          >
                                            View File
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm text-gray-700 truncate" title={attachment.filename}>
                                            {attachment.filename}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">No file uploaded</div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Internal Attachments */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="flex">
                <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl flex justify-between items-center w-full">
                  <h3 className="text-lg font-medium text-white">
                    Internal Attachments
                  </h3>
                </div>
              </div>
              <div className="p-6">
                {!siData.internal_attachments || siData.internal_attachments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No internal attachments added yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-red-800">
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "120px" }}>
                            File Type
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "250px" }}>
                            File Name
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "120px" }}>
                            Upload At
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold" style={{ width: "300px" }}>
                            File
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {siData.internal_attachments.map((attachment) => (
                          <tr key={attachment.id} className="border-b">
                            <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                              <div className="text-gray-700 font-medium text-sm truncate" title={attachment.content_type || "File Type"}>
                                {attachment.content_type || "File Type"}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="text-gray-700 text-sm" title={attachment.filename}>
                                {attachment.filename}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                              <div className="text-gray-700 text-sm text-center" title={attachment.created_at}>
                                {new Date(attachment.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                              <div className="flex items-center gap-2">
                                {attachment.url || attachment.doc_path ? (
                                  <div className="flex items-center gap-2 w-full">
                                    {attachment.content_type?.startsWith("image/") ? (
                                      <div className="flex items-center gap-2">
                                        <div className="group relative flex-shrink-0">
                                          <img
                                            src={attachment.url || attachment.doc_path}
                                            alt={attachment.filename}
                                            className="w-10 h-10 object-cover rounded border cursor-pointer hover:opacity-75"
                                            onClick={() => window.open(attachment.url || attachment.doc_path, "_blank")}
                                            title="Click to view full image"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm text-gray-700 truncate" title={attachment.filename}>
                                            {attachment.filename}
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 w-full">
                                        <div className="group relative flex-shrink-0">
                                          <div
                                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors text-xs whitespace-nowrap"
                                            onClick={() => window.open(attachment.url || attachment.doc_path, "_blank")}
                                            title="Click to download file"
                                          >
                                            View File
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm text-gray-700 truncate" title={attachment.filename}>
                                            {attachment.filename}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-sm text-gray-500">No file uploaded</div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remark</h3>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{siData.remark || ""}</p>
              <p className="text-xs text-gray-500 mt-2">
                Date: {siData.si_date}
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Comments</h3>
            {siData.status_logs && siData.status_logs.length > 0 ? (
              //   siData.status_logs.map((comment: any, index: number) => (
              // <div key={index} className="bg-gray-100 p-4 rounded-lg mb-3">
              <div className="bg-gray-100 p-4 rounded-lg mb-3">
                <p className="text-sm text-gray-700">
                  {siData?.status_logs[0]?.admin_comment || ""}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {/* Rememebr To Date and Time */}
                  Date:{" "}
                  {new Date(siData?.status_logs[0]?.created_at).toLocaleString(
                    "en-GB"
                  )}
                  {/* To date only  */}
                  {/* {new Date(siData?.status_logs[0]?.created_at).toLocaleDateString("en-GB")} */}
                  {/* To Time only  */}
                  {/* {new Date(siData?.status_logs[0]?.created_at).toLocaleTimeString("en-GB")} */}
                </p>
              </div>
            ) : (
              //   ))
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            )}

            {/* Add New Comment */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add a comment..."
              />
            </div>
          </div>

          {/* Status Update Section - Same design as SIDetails */}
          <div className="flex items-center justify-end mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 mr-3">
              Status
            </label>
            <div className="flex flex-col">
              <SelectBox
                name="status"
                options={approvalStatusOptions}
                control={control}
                placeholder="Select Status"
                required={true}
                isDisabled={currentUserApproved || siData?.status === "approved"}
              />
            </div>
          </div>

          {/* Add New Comment - Same design as SIDetails */}

          {/* Buttons - Same design as SIDetails */}
          <div className="flex space-x-3 justify-end">
            <button onClick={() => window.print()} className="purple-btn2 w-32">
              Print
            </button>
            <button 
              onClick={handleStatusUpdate} 
              className={`w-32 ${
                currentUserApproved || siData?.status === "approved"
                  ? "purple-btn2 opacity-50 cursor-not-allowed" 
                  : "purple-btn2"
              }`}
              disabled={currentUserApproved || siData?.status === "approved"}
            >
              Submit
            </button>
            <button
              onClick={() => navigate("/engineering/service-indent")}
              className="purple-btn1 w-32"
            >
              Cancel
            </button>
          </div>

          {/* Audit Log */}
          <h5 className="px-3 mt-3">Audit Log</h5>
          <div className="mb-8">
            <div className="bg-white shadow overflow-hidden">
              <table className="w-full">
                <thead
                  className="bg-red-800 text-white"
                  style={{ background: "var(--red)" }}
                >
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Sr.No.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {siData.status_logs && siData.status_logs.length > 0 ? (
                    siData.status_logs.map(
                      (
                        log: {
                          created_by_name?: string;
                          created_at?: string;
                          status?: string;
                          remarks?: string;
                        },
                        index: number
                      ) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{index + 1}</td>
                          <td className="px-4 py-3 text-sm">
                            {log.created_by_name || ""}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {log.created_at
                              ? new Date(log.created_at).toLocaleString("en-GB")
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {log.status
                              ? log.status.replace(/_/g, " ").toUpperCase()
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {log.remarks || "-"}
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-sm text-gray-500 text-center"
                      >
                        No audit logs found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Log Modal */}
          {showApprovalModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-8 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className=" text-red-800 p-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold">Approval Log</h2>
                  <button
                    onClick={() => setShowApprovalModal(false)}
                    className="text-white hover:text-gray-200 text-2xl font-bold"
                  >
                    <span className="text-red-700 hover:text-red-800">×</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-red-800 text-white">
                          <th className="border border-gray-300 py-2 text-sm font-medium">
                            Sr.No.
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">
                            Approval Level
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">
                            Date
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">
                            Status
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">
                            Comment
                          </th>
                          <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium">
                            Users
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {siData?.invoice_approval_histories &&
                        siData.invoice_approval_histories.length > 0 ? (
                          siData.invoice_approval_histories.map(
                            (history, index: number) => (
                              <tr key={history.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  {index + 1}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  {history.invoice_approval_level_name}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  {history.status_updated_at
                                    ? new Date(
                                        history.status_updated_at
                                      ).toLocaleDateString("en-GB") +
                                      ", " +
                                      new Date(
                                        history.status_updated_at
                                      ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : new Date(
                                        history.created_at
                                      ).toLocaleDateString("en-GB") +
                                      ", " +
                                      new Date(
                                        history.created_at
                                      ).toLocaleTimeString("en-GB", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                      history.approve === true
                                        ? "bg-green-700 text-white"
                                        : history.approve === false
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {history.approve === true
                                      ? "APPROVED"
                                      : history.approve === false
                                      ? "REJECTED"
                                      : "PENDING"}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  {history.rejection_reason || "-"}
                                </td>
                                <td className="border border-gray-300 px-4 py-3 text-sm">
                                  {Array.isArray(
                                    history.invoice_approval_level_approvers
                                  )
                                    ? history.invoice_approval_level_approvers.join(
                                        ", "
                                      )
                                    : history.updated_by_name || "-"}
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="border border-gray-300 px-4 py-3 text-sm text-gray-500 text-center"
                            >
                              No approval history found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIDetails;
