import React from "react";
import { useForm } from "react-hook-form";

interface OtherDetailsFormData {
  insuranceDetails: string;
  safetyCompliance: string;
  environmentalClearance: string;
  qualityStandards: string;
  workingHours: string;
  laborWelfare: string;
  emergencyContact: string;
  specialInstructions: string;
}

export default function OtherDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<OtherDetailsFormData>();

  const onSubmit = (data: OtherDetailsFormData) => {
    console.log("Other Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Insurance Details
            </label>
            <textarea
              {...register("insuranceDetails")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter insurance details"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Compliance
            </label>
            <select
              {...register("safetyCompliance")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Compliance Level</option>
              <option value="basic">Basic Safety Standards</option>
              <option value="enhanced">Enhanced Safety Standards</option>
              <option value="iso">ISO Safety Standards</option>
              <option value="custom">Custom Safety Standards</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environmental Clearance
            </label>
            <select
              {...register("environmentalClearance")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Status</option>
              <option value="required">Required</option>
              <option value="not_required">Not Required</option>
              <option value="obtained">Obtained</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Standards
            </label>
            <select
              {...register("qualityStandards")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Quality Standard</option>
              <option value="is">IS Standards</option>
              <option value="iso">ISO Standards</option>
              <option value="bis">BIS Standards</option>
              <option value="custom">Custom Standards</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours
            </label>
            <input
              {...register("workingHours")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., 8:00 AM - 6:00 PM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Labor Welfare Requirements
            </label>
            <textarea
              {...register("laborWelfare")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter labor welfare requirements"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Contact Person
            </label>
            <input
              {...register("emergencyContact")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Name and contact number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            {...register("specialInstructions")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={5}
            placeholder="Enter any special instructions or requirements"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium text-gray-800 mb-3">Additional Requirements</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="materialInspection"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="materialInspection" className="ml-2 text-sm text-gray-700">
                Material inspection required before use
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="progressReports"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="progressReports" className="ml-2 text-sm text-gray-700">
                Weekly progress reports required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="thirdPartyInspection"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="thirdPartyInspection" className="ml-2 text-sm text-gray-700">
                Third-party inspection required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="completionCertificate"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="completionCertificate" className="ml-2 text-sm text-gray-700">
                Completion certificate required
              </label>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-800 mb-3">Compliance Checklist</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="laborLicense"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="laborLicense" className="ml-2 text-sm text-gray-700">
                  Labor License
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="contractorLicense"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="contractorLicense" className="ml-2 text-sm text-gray-700">
                  Contractor License
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pfRegistration"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="pfRegistration" className="ml-2 text-sm text-gray-700">
                  PF Registration
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="esiRegistration"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="esiRegistration" className="ml-2 text-sm text-gray-700">
                  ESI Registration
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="wcpPolicy"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="wcpPolicy" className="ml-2 text-sm text-gray-700">
                  WCP Policy
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="gstRegistration"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="gstRegistration" className="ml-2 text-sm text-gray-700">
                  GST Registration
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
