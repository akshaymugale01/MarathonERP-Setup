import React from "react";

interface CompanyFormActionsProps {
  mode: "create" | "edit" | "view";
  isSubmitting: boolean;
  onCancel: () => void;
}

const CompanyFormActions: React.FC<CompanyFormActionsProps> = ({
  mode,
  isSubmitting,
  onCancel,
}) => {
  const isReadOnly = mode === "view";

  return (
    <div className="flex justify-end space-x-4 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        {isReadOnly ? "Close" : "Cancel"}
      </button>
      {!isReadOnly && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : mode === "create" ? "Create Company" : "Update Company"}
        </button>
      )}
    </div>
  );
};

export default CompanyFormActions;
