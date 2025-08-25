import React from "react";
import { useForm } from "react-hook-form";

interface ContractorConsultantDetailsFormData {
  contractorName: string;
  contractorType: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  contactPerson: string;
  mobileNumber: string;
  emailAddress: string;
  officeAddress: string;
  consultantName: string;
  consultantType: string;
  consultantContact: string;
  consultantEmail: string;
}

export default function ContractorConsultantDetails() {
  const {
    register,
    handleSubmit,
  } = useForm<ContractorConsultantDetailsFormData>();

  const onSubmit = (data: ContractorConsultantDetailsFormData) => {
    console.log("Contractor/Consultant Details:", data);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Contractor/Consultant Details</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Contractor Details Section */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Contractor Details</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contractor Name *
              </label>
              <input
                {...register("contractorName", { required: true })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter contractor name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contractor Type
              </label>
              <select
                {...register("contractorType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Type</option>
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>
                <option value="private_limited">Private Limited</option>
                <option value="public_limited">Public Limited</option>
                <option value="proprietorship">Proprietorship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Number
              </label>
              <input
                {...register("registrationNumber")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter registration number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST Number
              </label>
              <input
                {...register("gstNumber")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter GST number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Number
              </label>
              <input
                {...register("panNumber")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter PAN number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                {...register("contactPerson", { required: true })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter contact person name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                {...register("mobileNumber", { required: true })}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register("emailAddress")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Address
            </label>
            <textarea
              {...register("officeAddress")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter complete office address"
            />
          </div>
        </div>

        {/* Consultant Details Section */}
        <div className="bg-white border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4 border-b pb-2">Consultant Details</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultant Name
              </label>
              <input
                {...register("consultantName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter consultant name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultant Type
              </label>
              <select
                {...register("consultantType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Type</option>
                <option value="architect">Architect</option>
                <option value="engineer">Engineer</option>
                <option value="project_manager">Project Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="quality_controller">Quality Controller</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultant Contact
              </label>
              <input
                {...register("consultantContact")}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter consultant contact number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultant Email
              </label>
              <input
                {...register("consultantEmail")}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter consultant email"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Additional Information</h4>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Work Experience
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Describe previous work experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Skills/Certifications
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="List special skills and certifications"
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="backgroundVerified"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="backgroundVerified" className="ml-2 text-sm text-gray-700">
                Background verification completed
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="documentsVerified"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="documentsVerified" className="ml-2 text-sm text-gray-700">
                All documents verified
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="approvedVendor"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="approvedVendor" className="ml-2 text-sm text-gray-700">
                Approved vendor
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
