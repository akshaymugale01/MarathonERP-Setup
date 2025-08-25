import React from "react";
import { useForm } from "react-hook-form";

interface ServiceIndentDetailsFormData {
  serviceIndentNo: string;
  indentDate: string;
  serviceType: string;
  serviceDescription: string;
  quantity: string;
  unitRate: string;
  totalAmount: string;
}

export default function ServiceIndentDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<ServiceIndentDetailsFormData>();

  const onSubmit = (data: ServiceIndentDetailsFormData) => {
    console.log("Service Indent Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Service Indent Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Indent No.
            </label>
            <input
              {...register("serviceIndentNo")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter service indent number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Indent Date
            </label>
            <input
              {...register("indentDate")}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              {...register("serviceType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Service Type</option>
              <option value="construction">Construction</option>
              <option value="maintenance">Maintenance</option>
              <option value="consulting">Consulting</option>
              <option value="supply">Supply</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              {...register("quantity")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit Rate
            </label>
            <input
              {...register("unitRate")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter unit rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount
            </label>
            <input
              {...register("totalAmount")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Calculated total amount"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Description
          </label>
          <textarea
            {...register("serviceDescription")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Enter detailed service description"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Service Summary</h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>Total Services:</span>
              <span>0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Quantity:</span>
              <span>0</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>₹ 0.00</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-800">Service Items</h4>
            <button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Add Service Item
            </button>
          </div>

          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sr. No.</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Service Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No service items added yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}
