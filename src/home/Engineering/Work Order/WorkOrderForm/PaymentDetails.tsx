import React from "react";
import { useForm } from "react-hook-form";

interface PaymentDetailsFormData {
  paymentTerms: string;
  advancePayment: string;
  advancePercentage: string;
  milestonePayments: string;
  finalPayment: string;
  paymentCycle: string;
  penaltyClause: string;
  bonusClause: string;
}

interface PaymentMilestone {
  id: string;
  description: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
}

export default function PaymentDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<PaymentDetailsFormData>();

  const onSubmit = (data: PaymentDetailsFormData) => {
    console.log("Payment Details:", data);
  };

  // Sample payment milestones data
  const paymentMilestones: PaymentMilestone[] = [
    {
      id: "1",
      description: "Advance Payment",
      percentage: 10,
      amount: 100000,
      dueDate: "2024-01-15",
      status: "pending"
    },
    {
      id: "2", 
      description: "Foundation Complete",
      percentage: 25,
      amount: 250000,
      dueDate: "2024-02-15",
      status: "pending"
    },
    {
      id: "3",
      description: "Structure Complete",
      percentage: 35,
      amount: 350000,
      dueDate: "2024-04-15", 
      status: "pending"
    },
    {
      id: "4",
      description: "Finishing Work Complete",
      percentage: 25,
      amount: 250000,
      dueDate: "2024-06-15",
      status: "pending"
    },
    {
      id: "5",
      description: "Final Payment",
      percentage: 5,
      amount: 50000,
      dueDate: "2024-07-15",
      status: "pending"
    }
  ];

  const getStatusColor = (status: PaymentMilestone["status"]) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "pending": return "text-orange-600 bg-orange-50";
      case "overdue": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Payment Terms Section */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Payment Terms</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Terms *
              </label>
              <select
                {...register("paymentTerms", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Payment Terms</option>
                <option value="milestone">Milestone Based</option>
                <option value="monthly">Monthly</option>
                <option value="completion">On Completion</option>
                <option value="advance_progress">Advance + Progress</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Cycle
              </label>
              <select
                {...register("paymentCycle")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Cycle</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="milestone">Milestone Based</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Payment Amount
              </label>
              <input
                {...register("advancePayment")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter advance payment amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advance Payment Percentage (%)
              </label>
              <input
                {...register("advancePercentage")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter percentage"
              />
            </div>
          </div>
        </div>

        {/* Payment Schedule Section */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-semibold text-gray-800">Payment Milestones</h4>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Add Milestone
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sr. No.
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Percentage (%)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Amount (₹)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Due Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentMilestones.map((milestone, index) => (
                  <tr key={milestone.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {milestone.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {milestone.percentage}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      ₹ {milestone.amount.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                        {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Payment Terms */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Additional Terms</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Penalty Clause
              </label>
              <textarea
                {...register("penaltyClause")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Enter penalty terms for delays"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bonus Clause
              </label>
              <textarea
                {...register("bonusClause")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Enter bonus terms for early completion"
              />
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Payment Summary</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Contract Value:</span>
                <span>₹ 10,00,000.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Advance Payment:</span>
                <span>₹ 1,00,000.00 (10%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Milestone Payments:</span>
                <span>₹ 8,50,000.00 (85%)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Final Payment:</span>
                <span>₹ 50,000.00 (5%)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Total Milestones:</span>
                <span>5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Completed:</span>
                <span className="text-green-600">0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Pending:</span>
                <span className="text-orange-600">5</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Amount Paid:</span>
                <span className="text-green-600">₹ 0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Payment Methods</h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="bankTransfer"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                defaultChecked
              />
              <label htmlFor="bankTransfer" className="ml-2 text-sm text-gray-700">
                Bank Transfer (NEFT/RTGS)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="cheque"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="cheque" className="ml-2 text-sm text-gray-700">
                Cheque
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="dd"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="dd" className="ml-2 text-sm text-gray-700">
                Demand Draft
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="cash"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="cash" className="ml-2 text-sm text-gray-700">
                Cash (for small amounts only)
              </label>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-yellow-800 mb-3">Important Payment Terms</h4>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• All payments will be made after verification of work completion</li>
            <li>• TDS will be deducted as per applicable rates</li>
            <li>• Payment will be released within 30 days of bill submission</li>
            <li>• Any penalty for delay will be deducted from final payment</li>
            <li>• All statutory compliances must be up to date for payment release</li>
            <li>• Final payment will be released after defect liability period</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
