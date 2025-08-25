import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdClose } from "react-icons/md";
import BasicDetails from "./WorkOrderForm/BasicDetails";
import TaxDetails from "./WorkOrderForm/TaxDetails";
import RetentionDetails from "./WorkOrderForm/RetentionDetails";
import ServiceIndentDetails from "./WorkOrderForm/ServiceIndentDetails";
import OtherDetails from "./WorkOrderForm/OtherDetails";
import ContractorConsultantDetails from "./WorkOrderForm/ContractorConsultantDetails";
import EMDChequeDetails from "./WorkOrderForm/EMDChequeDetails";
import Documents from "./WorkOrderForm/Documents";
import PaymentDetails from "./WorkOrderForm/PaymentDetails";

interface TabType {
  id: string;
  label: string;
  component: React.ComponentType;
}

const tabs: TabType[] = [
  { id: "basic", label: "Basic Details", component: BasicDetails },
  { id: "tax", label: "Tax Details", component: TaxDetails },
  { id: "retention", label: "Retention Details", component: RetentionDetails },
  {
    id: "service",
    label: "Service Indent Details",
    component: ServiceIndentDetails,
  },
  { id: "other", label: "Other Details", component: OtherDetails },
  {
    id: "contractor",
    label: "Contractor/Consultant Details",
    component: ContractorConsultantDetails,
  },
  { id: "emd", label: "EMD Cheque/BG details", component: EMDChequeDetails },
  { id: "documents", label: "Documents", component: Documents },
  { id: "payment", label: "Payment details", component: PaymentDetails },
];

export default function WorkOrderCreate() {
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { id } = useParams();

  // Determine the mode based on URL
  const isEditMode = Boolean(id);
  const isViewMode = window.location.pathname.includes("/details");

  const getPageTitle = () => {
    if (isViewMode) return "View Work Order";
    if (isEditMode) return "Edit Work Order";
    return "Create Work Order";
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    if (isEditMode) {
      console.log("Updating work order...");
      // Handle update logic here
    } else {
      console.log("Creating work order...");
      // Handle create logic here
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || BasicDetails;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          {/* <div className="bg-red-800 text-white px-6 py-4 flex justify-between items-center">
            {/* <h2 className="text-xl font-semibold">{getPageTitle()}</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              <MdClose />
            </button>
          </div> */}

          {/* Notes Section */}
          <div className="px-6 py-4 mb-4 bg-blue-50 border-b">
            <h3 className="font-semibold text-gray-700 mb-2">Note:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • Work Order tax amount will not change, if % of work order Value
                is changed
              </li>
              <li>
                • % of Work Order Value will be used to calculate taxable amounts
                in Work Order payments
              </li>
            </ul>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium border-r transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-red-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>

          {/* Footer Actions */}
          {!isViewMode && (
            <div className="border-t bg-gray-50 px-6 py-4 flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-red-800 hover:bg-red-900 text-white px-6 py-2 rounded transition-colors"
              >
                {isEditMode ? "Update" : "Create"}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
