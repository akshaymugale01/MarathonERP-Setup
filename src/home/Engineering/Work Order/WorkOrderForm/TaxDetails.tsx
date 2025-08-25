import React from "react";
import { useForm } from "react-hook-form";

interface TaxDetailsFormData {
  taxType: string;
  taxRate: string;
  taxAmount: string;
  totalAmount: string;
}

export default function TaxDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<TaxDetailsFormData>();

  const onSubmit = (data: TaxDetailsFormData) => {
    console.log("Tax Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Type
            </label>
            <select
              {...register("taxType")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Tax Type</option>
              <option value="GST">GST</option>
              <option value="VAT">VAT</option>
              <option value="Service Tax">Service Tax</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Rate (%)
            </label>
            <input
              {...register("taxRate")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter tax rate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Amount
            </label>
            <input
              {...register("taxAmount")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Calculated tax amount"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount (Including Tax)
            </label>
            <input
              {...register("totalAmount")}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Total amount with tax"
              readOnly
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-2">Tax Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base Amount:</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Amount:</span>
              <span>₹ 0.00</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>₹ 0.00</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
