import React from "react";
import { useForm } from "react-hook-form";

interface EMDChequeDetailsFormData {
  emdType: string;
  emdAmount: string;
  chequeNumber: string;
  chequeDate: string;
  bankName: string;
  branchName: string;
  bgNumber: string;
  bgDate: string;
  bgExpiryDate: string;
  bgAmount: string;
  issuingBank: string;
  beneficiaryName: string;
}

export default function EMDChequeDetails() {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<EMDChequeDetailsFormData>();

  const emdType = watch("emdType");

  const onSubmit = (data: EMDChequeDetailsFormData) => {
    console.log("EMD/Cheque/BG Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">EMD Cheque/BG Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* EMD Type Selection */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">EMD Type</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select EMD Type *
            </label>
            <select
              {...register("emdType", { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select EMD Type</option>
              <option value="cheque">Cheque</option>
              <option value="dd">Demand Draft</option>
              <option value="bg">Bank Guarantee</option>
              <option value="fd">Fixed Deposit</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              EMD Amount *
            </label>
            <input
              {...register("emdAmount", { required: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter EMD amount"
            />
          </div>
        </div>

        {/* Cheque Details (shown when EMD type is cheque or DD) */}
        {(emdType === "cheque" || emdType === "dd") && (
          <div className="bg-blue-50 border rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4">
              {emdType === "cheque" ? "Cheque Details" : "Demand Draft Details"}
            </h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {emdType === "cheque" ? "Cheque Number" : "DD Number"} *
                </label>
                <input
                  {...register("chequeNumber", { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`Enter ${emdType === "cheque" ? "cheque" : "DD"} number`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {emdType === "cheque" ? "Cheque Date" : "DD Date"} *
                </label>
                <input
                  {...register("chequeDate", { required: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name *
                </label>
                <input
                  {...register("bankName", { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  {...register("branchName")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter branch name"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Guarantee Details (shown when EMD type is BG) */}
        {emdType === "bg" && (
          <div className="bg-green-50 border rounded-lg p-6">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Bank Guarantee Details</h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BG Number *
                </label>
                <input
                  {...register("bgNumber", { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter BG number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BG Date *
                </label>
                <input
                  {...register("bgDate", { required: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BG Expiry Date *
                </label>
                <input
                  {...register("bgExpiryDate", { required: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BG Amount *
                </label>
                <input
                  {...register("bgAmount", { required: true })}
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter BG amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Bank *
                </label>
                <input
                  {...register("issuingBank", { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter issuing bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beneficiary Name *
                </label>
                <input
                  {...register("beneficiaryName", { required: true })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter beneficiary name"
                />
              </div>
            </div>
          </div>
        )}

        {/* Summary Section */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">EMD Summary</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">EMD Type:</span>
                <span>{emdType ? emdType.toUpperCase() : "Not Selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">EMD Amount:</span>
                <span>₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-orange-600">Pending</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Work Order Value:</span>
                <span>₹ 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">EMD Percentage:</span>
                <span>0%</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Validity:</span>
                <span>-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-yellow-800 mb-3">Important Notes</h4>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li>• EMD amount should be as per tender conditions</li>
            <li>• Bank Guarantee should be valid for the entire contract period plus claim period</li>
            <li>• Cheque should be drawn in favor of the company</li>
            <li>• All EMD documents should be submitted before work commencement</li>
            <li>• EMD will be refunded as per contract terms after successful completion</li>
          </ul>
        </div>

        {/* Verification Checklist */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Verification Checklist</h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="documentsReceived"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="documentsReceived" className="ml-2 text-sm text-gray-700">
                All EMD documents received
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="amountVerified"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="amountVerified" className="ml-2 text-sm text-gray-700">
                EMD amount verified
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="validityChecked"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="validityChecked" className="ml-2 text-sm text-gray-700">
                Validity period checked
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="approvedByFinance"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="approvedByFinance" className="ml-2 text-sm text-gray-700">
                Approved by finance department
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
