import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  ServiceIndentDetails, 
  StatusUpdateRequest, 
  ApprovalRequest,
  ServiceIndentStatus 
} from "../../../types/Home/engineering/serviceIndent";
import {
  getServiceIndentDetails,
  updateServiceIndentStatus,
  submitApproval
} from "../../../services/Home/Engineering/serviceIndentStatusService";

interface StatusFormData {
  status: ServiceIndentStatus;
  comments: string;
  operator_name: string;
}

interface ApprovalFormData {
  approval_status: 'approved' | 'rejected';
  comments: string;
}

export default function ServiceIndentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [serviceIndent, setServiceIndent] = useState<ServiceIndentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApprovalLogs, setShowApprovalLogs] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalType, setApprovalType] = useState<'site_head' | 'estimation_executive'>('site_head');

  const { control, handleSubmit, watch, setValue } = useForm<StatusFormData>({
    defaultValues: {
      status: 'draft',
      comments: '',
      operator_name: ''
    }
  });

  const { 
    control: approvalControl, 
    handleSubmit: handleApprovalSubmit
  } = useForm<ApprovalFormData>({
    defaultValues: {
      approval_status: 'approved',
      comments: ''
    }
  });

  const currentStatus = watch('status');

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        try {
          setLoading(true);
          const details = await getServiceIndentDetails(Number(id));
          setServiceIndent(details);
          setValue('status', details.status as ServiceIndentStatus);
        } catch (error) {
          console.error('Error loading service indent details:', error);
          toast.error('Failed to load service indent details');
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadData();
  }, [id, setValue]);

  const loadServiceIndentDetails = async () => {
    try {
      setLoading(true);
      const details = await getServiceIndentDetails(Number(id));
      setServiceIndent(details);
      setValue('status', details.status as ServiceIndentStatus);
    } catch (error) {
      console.error('Error loading service indent details:', error);
      toast.error('Failed to load service indent details');
    } finally {
      setLoading(false);
    }
  };

  const onStatusSubmit = async (data: StatusFormData) => {
    if (!serviceIndent) return;

    try {
      const statusUpdate: StatusUpdateRequest = {
        status: data.status,
        comments: data.comments,
        remarks: `Status changed to ${data.status}`,
        operator_id: 1 // This should come from user context
      };

      await updateServiceIndentStatus(serviceIndent.id, statusUpdate);
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      await loadServiceIndentDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const onApprovalSubmit = async (data: ApprovalFormData) => {
    if (!serviceIndent) return;

    try {
      const approvalRequest: ApprovalRequest = {
        approval_type: approvalType,
        approval_status: data.approval_status,
        comments: data.comments
      };

      await submitApproval(serviceIndent.id, approvalRequest);
      toast.success(`${approvalType.replace('_', ' ')} ${data.approval_status} successfully`);
      setShowApprovalModal(false);
      await loadServiceIndentDetails();
    } catch (error) {
      console.error('Error submitting approval:', error);
      toast.error('Failed to submit approval');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canShowApprovalLogs = () => {
    return serviceIndent?.status === 'submitted' || 
           serviceIndent?.status === 'approved' || 
           serviceIndent?.approval_logs?.length > 0;
  };

  const canApprove = () => {
    return serviceIndent?.can_approve && 
           (serviceIndent?.status === 'submitted' || 
            serviceIndent?.current_approval_stage);
  };

  const canManage = () => {
    return serviceIndent?.can_manage && serviceIndent?.status === 'approved';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading service indent details...</div>
      </div>
    );
  }

  if (!serviceIndent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-600">Service indent not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Service Indent Details
              </h1>
              <p className="text-gray-600">SI Code: {serviceIndent.si_code}</p>
            </div>
            <div className="flex items-center gap-4">
              {canShowApprovalLogs() && (
                <button
                  onClick={() => setShowApprovalLogs(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approval Logs
                </button>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(serviceIndent.status)}`}>
                {serviceIndent.status?.charAt(0).toUpperCase() + serviceIndent.status?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Service Indent Information */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <p className="text-gray-900">{serviceIndent.project_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Project
                </label>
                <p className="text-gray-900">{serviceIndent.site_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SI Date
                </label>
                <p className="text-gray-900">{serviceIndent.si_date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Work Order
                </label>
                <p className="text-gray-900">{serviceIndent.type_of_work_order}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Contract
                </label>
                <p className="text-gray-900">{serviceIndent.type_of_contract}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisitioner
                </label>
                <p className="text-gray-900">{serviceIndent.requistioner_name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Categories */}
        {serviceIndent.si_work_categories && serviceIndent.si_work_categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Work Categories</h2>
              <div className="space-y-4">
                {serviceIndent.si_work_categories.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">{category.level_one_name}</span>
                        {category.level_two_name && (
                          <span className="text-gray-600"> → {category.level_two_name}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Start: {category.planned_date_start_work} | 
                        End: {category.planned_finish_date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Comments</h2>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="Add your comments here..."
            />
          </div>
        </div>

        {/* Status and Actions */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Status & Actions</h2>
              <div className="flex gap-4">
                {canApprove() && (
                  <>
                    <button
                      onClick={() => {
                        setApprovalType('site_head');
                        setShowApprovalModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Site Head Approval
                    </button>
                    <button
                      onClick={() => {
                        setApprovalType('estimation_executive');
                        setShowApprovalModal(true);
                      }}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                      Estimation Executive Approval
                    </button>
                  </>
                )}
                {canManage() && (
                  <button
                    onClick={() => navigate(`/home/engineering/service-indent/${id}/manage`)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Manage SI
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={currentStatus}
                onChange={(e) => setValue('status', e.target.value as ServiceIndentStatus)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_progress">In Progress</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
              </select>
              
              <input
                type="text"
                placeholder="Operator Name"
                className="border border-gray-300 rounded-md px-3 py-2"
                {...control.register?.('operator_name')}
              />
              
              <button
                onClick={() => setShowStatusModal(true)}
                className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900"
              >
                Submit
              </button>
              
              <button
                onClick={() => navigate('/home/engineering/service-indent')}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Audit Log</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-800">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Sr.No.
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      User
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Status
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceIndent.status_logs?.map((log, index) => (
                    <tr key={index} className="border-b">
                      <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-2">{log.operator_name}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(log.status)}`}>
                          {log.status?.charAt(0).toUpperCase() + log.status?.slice(1)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{log.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Status</h3>
            <form onSubmit={handleSubmit(onStatusSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...control.register?.('comments')}
                  placeholder="Add comments for this status change..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {approvalType.replace('_', ' ').toUpperCase()} Approval
            </h3>
            <form onSubmit={handleApprovalSubmit(onApprovalSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Decision</label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...approvalControl.register?.('approval_status')}
                >
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Comments</label>
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-md p-2"
                  {...approvalControl.register?.('comments')}
                  placeholder="Add comments for this approval..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-900"
                >
                  Submit Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Logs Modal */}
      {showApprovalLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Approval Logs</h3>
              <button
                onClick={() => setShowApprovalLogs(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-red-800">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Sr.No.
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      User
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Date
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Approval Type
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Status
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                      Comments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceIndent.approval_logs?.map((log, index) => (
                    <tr key={index} className="border-b">
                      <td className="border border-gray-300 px-3 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-3 py-2">{log.approver_name}</td>
                      <td className="border border-gray-300 px-3 py-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        {log.approval_type.replace('_', ' ').toUpperCase()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.approval_status === 'approved' ? 'bg-green-100 text-green-800' : 
                          log.approval_status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.approval_status?.charAt(0).toUpperCase() + log.approval_status?.slice(1)}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{log.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
