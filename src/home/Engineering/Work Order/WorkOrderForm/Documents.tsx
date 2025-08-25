import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdUpload, MdDelete, MdVisibility, MdDownload } from "react-icons/md";

interface DocumentsFormData {
  documentType: string;
  documentName: string;
  description: string;
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: "uploaded" | "pending" | "approved" | "rejected";
}

export default function Documents() {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<DocumentsFormData>();

  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const onSubmit = (data: DocumentsFormData) => {
    console.log("Documents:", data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newDoc: UploadedDocument = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          uploadDate: new Date().toLocaleDateString(),
          status: "uploaded"
        };
        setUploadedDocuments(prev => [...prev, newDoc]);
      });
    }
  };

  const handleDeleteDocument = (id: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const getStatusColor = (status: UploadedDocument["status"]) => {
    switch (status) {
      case "uploaded": return "text-blue-600 bg-blue-50";
      case "pending": return "text-orange-600 bg-orange-50";
      case "approved": return "text-green-600 bg-green-50";
      case "rejected": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Documents</h3>
      
      {/* Document Upload Section */}
      <div className="bg-white border rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Upload Documents</h4>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type *
              </label>
              <select
                {...register("documentType", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Document Type</option>
                <option value="work_order">Work Order</option>
                <option value="contract">Contract Agreement</option>
                <option value="quotation">Quotation</option>
                <option value="emd_receipt">EMD Receipt</option>
                <option value="bg_copy">Bank Guarantee Copy</option>
                <option value="insurance">Insurance Certificate</option>
                <option value="license">License Copy</option>
                <option value="registration">Registration Certificate</option>
                <option value="pan_card">PAN Card</option>
                <option value="gst_certificate">GST Certificate</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                {...register("documentName")}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter document name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="Enter document description"
            />
          </div>

          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center space-y-2"
            >
              <MdUpload className="text-4xl text-gray-400" />
              <p className="text-lg text-gray-600">Click to upload documents</p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, XLS, XLSX
              </p>
              <p className="text-sm text-gray-500">Maximum file size: 10MB</p>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-2"
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Add Document Info
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-semibold text-gray-800">Uploaded Documents</h4>
          <span className="text-sm text-gray-600">
            {uploadedDocuments.length} document(s) uploaded
          </span>
        </div>

        {uploadedDocuments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sr. No.
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Document Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Size
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Upload Date
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
                {uploadedDocuments.map((doc, index) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {doc.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {doc.type || "Unknown"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {doc.size}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {doc.uploadDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <div className="flex space-x-2">
                        <button
                          title="View"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <MdVisibility size={16} />
                        </button>
                        <button
                          title="Download"
                          className="text-green-600 hover:text-green-800"
                        >
                          <MdDownload size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload documents using the form above</p>
          </div>
        )}
      </div>

      {/* Required Documents Checklist */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-md font-semibold text-yellow-800 mb-4">Required Documents Checklist</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="workOrderDoc"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="workOrderDoc" className="ml-2 text-sm text-gray-700">
                Work Order Document
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="contractAgreement"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="contractAgreement" className="ml-2 text-sm text-gray-700">
                Contract Agreement
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="emdReceipt"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="emdReceipt" className="ml-2 text-sm text-gray-700">
                EMD Receipt
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="insuranceCert"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="insuranceCert" className="ml-2 text-sm text-gray-700">
                Insurance Certificate
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="panCard"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="panCard" className="ml-2 text-sm text-gray-700">
                PAN Card Copy
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="gstCertificate"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="gstCertificate" className="ml-2 text-sm text-gray-700">
                GST Certificate
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="licenseCopy"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="licenseCopy" className="ml-2 text-sm text-gray-700">
                License Copy
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="bankGuarantee"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="bankGuarantee" className="ml-2 text-sm text-gray-700">
                Bank Guarantee (if applicable)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
