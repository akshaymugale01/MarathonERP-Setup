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
      status: "draft" // Set a proper default instead of empty string
    }
  });
  const navigate = useNavigate();
  const [siData, setSiData] = useState<ServiceIndent>(null);
  console.log("SI data", siData);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [newComment, setNewComment] = useState("");
  
  const watchedStatus = watch("status");

  const fetchSIData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServiceIndentById(id);
      setSiData(response);
      // Get the current status from service_indent.status instead of status_logs
      const currentStatus = response.status || "";
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

  const handleStatusUpdate = async () => {
    try {
      // Use watchedStatus as the primary source of truth
      const currentStatus = watchedStatus;
      const commentToSend = newComment || remarks;
      
      if (!currentStatus) {
        toast.error("Please select a status");
        return;
      }
      
      if (currentStatus === "submitted") {
        // For submitted status, use updateStatus with proper structure
        await siApi.updateStatus(Number(id), {
          status: currentStatus,
          remarks: commentToSend || "Submitted for approval",
          comments: commentToSend || "Service Indent submitted for approval workflow"
        });
        toast.success("SI submitted for approval");
        navigate(`/engineering/service-indent/${id}/approval`);
      } else if (currentStatus === "cancel") {
        await siApi.updateStatus(Number(id), {
          status: currentStatus,
          remarks: commentToSend || "SI cancelled",
          comments: commentToSend || "Service Indent cancelled"
        });
        toast.success("SI cancelled");
        // Add a small delay before refreshing to ensure backend is updated
        setTimeout(async () => {
          await fetchSIData();
        }, 500);
      } else {
        // For other status updates, use the same structure
        await siApi.updateStatus(Number(id), {
          status: currentStatus,
          remarks: commentToSend,
          comments: commentToSend
        });
        toast.success("Status updated successfully");
        // Add a small delay before refreshing to ensure backend is updated
        setTimeout(async () => {
          await fetchSIData();
        }, 500);
      }
      setRemarks("");
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

  const detailsStatusOptions = [
    { label: "Draft", value: "draft" },
    { label: "Submitted", value: "submitted" },
    { label: "Cancel", value: "cancel" },
  ];

  // Debug: Check current status values
  console.log("Current status data:", {
    watchedStatus,
    selectedStatus,
    serviceIndentStatus: siData?.status,
    latestFromLogs: siData?.status_logs && siData.status_logs.length > 0 
      ? siData.status_logs[siData.status_logs.length - 1]?.status 
      : "no logs"
  });

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
            {/* <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              onClick={() =>
                navigate(`/engineering/service-indent/${id}/approval`)
              }
            >
              Approval Logs
            </button> */}
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

          {/* Work Category Section */}
          {/* <div className="col-12">
            <h5>Work Category</h5>
            <div className="tbl-container me-2 mt-3">
              <table className="w-100" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: "66px" }}>Sr.No.</th>
                    <th>Work Category / Sub Work Category / L3 / L4 / L5</th>
                    <th style={{ width: "160px" }}>
                      Planned Date of Start Work
                    </th>
                    <th style={{ width: "160px" }}>Planned Finished Date</th>
                  </tr>
                </thead>
                <tbody>
                  {siData.si_work_categories?.map((cat, index) => {
                    const categoryLevels = [
                      cat.level_one_name,
                      cat.level_two_name,
                      cat.level_three_name,
                      cat.level_four_name,
                      cat.level_five_name,
                    ].filter(Boolean);
                    return (
                      <tr key={cat.id}>
                        <td>{index + 1}</td>
                        <td>{categoryLevels.join("-")}</td>
                        <td>{cat.planned_date_start_work}</td>
                        <td>{cat.planned_finish_date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div> */}

          {/* Service Summary - BOQ Activities & Services */}
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
                      <span>
                        End Date: {category.planned_finish_date}
                      </span>
                    </div>
                  </div>

                  {/* BOQ Activities Table for this work category */}
                  <div className="tbl-container me-2">
                    <table className="w-100" style={{ width: "100%" }}>
                      <thead className="bg-red-800 text-white">
                        <tr>
                          <th>Sr.No</th>
                          <th>
                            <input className="ml-1" type="checkbox" disabled></input>
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
                        {category.si_boq_activities?.map((activity, actIndex) => (
                          <React.Fragment key={activity.id || `new-${actIndex}`}>
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
                                  key={service.id || `new-service-${servIndex}`}
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
                                          service.required_qty = e.target.value;
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
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
              // Show the latest status log comment
              <div className="bg-gray-100 p-4 rounded-lg mb-3">
                <p className="text-sm text-gray-700">
                  {(() => {
                    const logs = siData.status_logs;
                    // Find latest log with admin_comment
                    const latestAdminLog = [...logs].reverse().find(log => log.admin_comment && log.admin_comment.trim());
                    if (latestAdminLog) {
                      return latestAdminLog.admin_comment;
                    }
                    // If no admin_comment, fallback to latest log's comments/remarks
                    const latestLog = logs[logs.length - 1];
                    return latestLog?.comments || latestLog?.remarks || "No comment available";
                  })()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Date:{" "}
                  {new Date(siData.status_logs[siData.status_logs.length - 1]?.created_at).toLocaleString(
                    "en-GB"
                  )}
                </p>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">No comments yet</p>
              </div>
            )}

            {/* Add New Comment */}
            <div className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Add a comment..."
              />
            </div>
          </div>

          {/* Status Update Section - Only for Draft Status */}
          {/* Status */}
          <div className="flex items-center justify-end mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 mr-3">
              Status
            </label>
            <div className="flex flex-col">
              <SelectBox
                name="status"
                options={detailsStatusOptions}
                control={control}
                placeholder="Select Status"
                required={true}
                isDisabled={siData?.status === "cancel"}
              />
            </div>
          </div>
        
          {/* Buttons */}
          <div className="flex space-x-3 justify-end">
            <button onClick={() => window.print()} className="purple-btn2 w-32">
              Print
            </button>
            <button 
              onClick={handleStatusUpdate} 
              className={`purple-btn2 w-32 ${siData?.status === "cancel" ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={siData?.status === "cancel"}
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

          {/* Action Buttons for Non-Draft Status */}
          {/* {!isDraftStatus && (
            <div className="flex justify-end space-x-4 mb-8">
              <button
                onClick={() => window.print()}
                className="purple-btn2 w-28"
              >
                Print
              </button>
              <button
                // onClick={() => window.print()}
                className="purple-btn2 w-28"
              >
                Submit
              </button>
              <button
                onClick={() => navigate("/engineering/service-indent")}
                className="purple-btn1 w-28"
              >
                Cancel
              </button>
              {siData.status_logs[0]?.status === "draft" && (
                <button
                  onClick={() =>
                    navigate(`/engineering/service-indent/${id}/edit`)
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit SI
                </button>
              )}
            </div>
          )} */}

          {/* Audit Log */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Audit Log</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-800 text-white">
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
                    // Reverse the array to show most recent first
                    [...siData.status_logs].reverse().map((log: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.user_name || ""}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(log.created_at).toLocaleString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.status?.replace("_", " ").toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.remarks || log.comments || log.admin_comment || "-"}
                        </td>
                      </tr>
                    ))
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
        </div>
      </div>
    </div>
  );
};

export default SIDetails;
