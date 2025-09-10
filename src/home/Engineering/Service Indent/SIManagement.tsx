import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { siApi } from "../../../services/Home/Engineering/siApi";
import { STATUS_OPTIONS } from "../../../types/si";
import { getServiceIndentById } from "../../../services/Home/Engineering/serviceIndentService";
import { ServiceIndent } from "../../../types/Home/engineering/serviceIndent";

const SIDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [siData, setSiData] = useState<ServiceIndent>(null);
  console.log("SI data", siData);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("draft");
  const [remarks, setRemarks] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (id) {
      fetchSIData();
    }
  }, [id]);

  const fetchSIData = async () => {
    try {
      setLoading(true);
      const response = await getServiceIndentById(id);
      setSiData(response);
      setSelectedStatus(response.status || "draft");
    } catch (error) {
      console.error("Error fetching SI data:", error);
      toast.error("Failed to fetch SI data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      if (selectedStatus === "submitted") {
        await siApi.submitForApproval(Number(id), remarks);
        toast.success("SI submitted for approval");
        navigate(`/home/engineering/service-indent/${id}/approval`);
      } else if (selectedStatus === "cancelled") {
        await siApi.cancelSI(Number(id), remarks);
        toast.success("SI cancelled");
        await fetchSIData();
      } else {
        await siApi.updateStatus(Number(id), {
          status: selectedStatus,
          remarks,
        });
        toast.success("Status updated successfully");
        await fetchSIData();
      }
      setRemarks("");
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

  const isDraftStatus = siData.status === "draft";
  const availableStatuses = STATUS_OPTIONS.filter((option) =>
    ["draft", "submitted", "cancelled"].includes(option.value)
  );

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
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
              onClick={() =>
                navigate(`/home/engineering/service-indent/${id}/approval`)
              }
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

          {/* Work Category Section */}
          <div className="col-12">
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
          </div>

          {/* Service Summary - BOQ Activities & Services */}
          <div className="col-12">
            <span className="font-bold">Boq Activity & Service</span>

            <div className="tbl-container me-2 mt-3">
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
                  {siData.si_work_categories?.map((category, catIndex) =>
                    category.si_boq_activities?.map((activity, actIndex) => (
                      <React.Fragment key={activity.id || `new-${actIndex}`}>
                        {/* Activity Row */}
                        <tr
                          className={
                            actIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="px-4 py-3 text-sm font-medium">
                            {catIndex + 1}.{actIndex + 1}
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
                                {catIndex + 1}.{actIndex + 1}.{servIndex + 1}
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
                    ))
                  )}
                </tbody>
              </table>
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
          {isDraftStatus && (
            <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">
                Update Status
              </h3>

              <div className="grid grid-cols-3 gap-6">
                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableStatuses.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operator Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator Name
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="">Select Operator...</option>
                    <option value="kartik_mane">Kartik Mane</option>
                    <option value="john_doe">John Doe</option>
                    <option value="jane_smith">Jane Smith</option>
                  </select>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks{" "}
                    {selectedStatus !== "draft" ? "(Required)" : "(Optional)"}
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Enter remarks..."
                    required={selectedStatus !== "draft"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
                >
                  Print
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={selectedStatus !== "draft" && !remarks.trim()}
                  className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {selectedStatus === "submitted"
                    ? "Submit"
                    : selectedStatus === "cancelled"
                    ? "Cancel"
                    : "Update"}
                </button>
                <button
                  onClick={() => navigate("/home/engineering/service-indent")}
                  className="px-6 py-2 border border-red-800 text-red-800 rounded-md hover:bg-red-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons for Non-Draft Status */}
          {!isDraftStatus && (
            <div className="flex justify-end space-x-4 mb-8">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
              >
                Print
              </button>
              <button
                onClick={() => navigate("/home/engineering/service-indent")}
                className="px-6 py-2 border border-red-800 text-red-800 rounded-md hover:bg-red-50"
              >
                Back to List
              </button>
              {siData.status === "draft" && (
                <button
                  onClick={() =>
                    navigate(`/home/engineering/service-indent/${id}/edit`)
                  }
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Edit SI
                </button>
              )}
            </div>
          )}

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
                    siData.status_logs.map((log: any, index: number) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.user_name || "System User"}
                        </td>
                        <td className="px-4 py-3 text-sm">{log.created_at}</td>
                        <td className="px-4 py-3 text-sm">
                          {log.status?.replace("_", " ").toUpperCase()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {log.remarks || "-"}
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
