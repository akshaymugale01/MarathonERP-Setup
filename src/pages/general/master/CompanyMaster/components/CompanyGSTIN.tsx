import React from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";
import SelectBox from "../../../../../components/forms/SelectBox";

interface GSTINEntry {
  id: string;
  gstin: string;
  address: string;
  pin_code: string;
  pms_state_id: number | string;
  _destroy?: boolean;
}

interface CompanyGSTINProps {
  control: Control<Company>;
  setValue: UseFormSetValue<Company>;
  isReadOnly: boolean;
  gstinEntries: GSTINEntry[];
  setGstinEntries: React.Dispatch<React.SetStateAction<GSTINEntry[]>>;
  allStateOptions: Array<{ value: number; label: string }>;
  addGSTINEntry: () => void;
  removeGSTINEntry: (id: string) => void;
}

const CompanyGSTIN: React.FC<CompanyGSTINProps> = ({
  control,
  setValue,
  isReadOnly,
  gstinEntries,
  setGstinEntries,
  allStateOptions,
  addGSTINEntry,
  removeGSTINEntry,
}) => {
  // Watch all GSTIN form values to sync with local state
  const watchedGSTIN = useWatch({
    control,
    name: "company_gstin_details_attributes",
    defaultValue: []
  });

  // Sync form values back to local state when form values change
  React.useEffect(() => {
    if (watchedGSTIN && Array.isArray(watchedGSTIN)) {
      console.log("Watched GSTIN values:", watchedGSTIN);
      setGstinEntries(prev => {
        const updated = prev.map((entry, index) => {
          const formEntry = watchedGSTIN[index];
          if (formEntry && formEntry.pms_state_id !== undefined && formEntry.pms_state_id !== entry.pms_state_id) {
            console.log(`Syncing state ID for entry ${index}: ${entry.pms_state_id} -> ${formEntry.pms_state_id}`);
            return { ...entry, pms_state_id: formEntry.pms_state_id };
          }
          return entry;
        });
        return updated;
      });
    }
  }, [watchedGSTIN, setGstinEntries]);

  const handleGSTINChange = (index: number, field: string, value: string) => {
    const updatedEntries = [...gstinEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setGstinEntries(updatedEntries);
    
    // Update the form field with the correct index and proper type conversion
    if (field === 'pms_state_id') {
      setValue(`company_gstin_details_attributes.${index}.${field}` as keyof Company, parseInt(value) || 0);
    } else {
      setValue(`company_gstin_details_attributes.${index}.${field}` as keyof Company, value);
    }
  };


  console.log("allState Options", allStateOptions);
  console.log("Current gstinEntries:", gstinEntries);
  console.log("Watched GSTIN form values:", watchedGSTIN);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">State wise GSTIN</h2>
        {!isReadOnly && (
          <button
            type="button"
            onClick={addGSTINEntry}
            className="px-4 py-2 bg-white text-red-800 border border-red-800 rounded-md hover:bg-red-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 inline-block mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add
          </button>
        )}
      </div>
      <div className="p-0">
        {gstinEntries.filter(entry => !entry._destroy).length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    State*
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    GSTIN
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Pin/Zip
                  </th>
                  {!isReadOnly && (
                    <th className="px-4 py-3 text-left font-semibold">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {gstinEntries
                  .map((entry, originalIndex) => ({ entry, originalIndex }))
                  .filter(({ entry }) => !entry._destroy)
                  .map(({ entry, originalIndex }, displayIndex) => (
                    <tr
                      key={entry.id}
                      className={displayIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3">
                        <SelectBox
                          name={`company_gstin_details_attributes.${originalIndex}.pms_state_id`}
                          control={control}
                          options={allStateOptions}
                          placeholder="Select GST State"
                          isDisabled={isReadOnly}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={entry.gstin}
                          onChange={(e) => handleGSTINChange(originalIndex, 'gstin', e.target.value)}
                          readOnly={isReadOnly}
                          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter GSTIN"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea
                          value={entry.address}
                          onChange={(e) => handleGSTINChange(originalIndex, 'address', e.target.value)}
                          readOnly={isReadOnly}
                          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter address"
                          rows={2}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={entry.pin_code}
                          onChange={(e) => handleGSTINChange(originalIndex, 'pin_code', e.target.value)}
                          readOnly={isReadOnly}
                          className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter pin code"
                        />
                      </td>
                      {!isReadOnly && (
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeGSTINEntry(entry.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {gstinEntries.filter(entry => !entry._destroy).length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p>No GSTIN entries added yet.</p>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addGSTINEntry}
                className="mt-4 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 inline-block mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add GSTIN Entry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyGSTIN;
