import React, { useState, useEffect } from "react";
import type { UseFormSetValue, FieldPath } from "react-hook-form";
import type { Company } from "../../../../../types/General/companies";

interface CompanyLogoUploadProps {
  isReadOnly: boolean;
  setValue: UseFormSetValue<Company>;
  existingLogo?: {
    id?: number;
    url?: string;
    filename?: string;
    active?: boolean;
  };
}

const CompanyLogoUpload: React.FC<CompanyLogoUploadProps> = ({
  isReadOnly,
  setValue,
  existingLogo,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existingLogo?.url || null
  );

  console.log("existing url", existingLogo);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (existingLogo?.url) {
      setPreviewUrl(existingLogo.url);
    }
  }, [existingLogo]);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file (JPG, PNG, GIF, SVG)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadError(null);
    setUploadedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Set the logo attributes for Rails nested attributes
    setValue("logo_attributes" as FieldPath<Company>, {
      id: existingLogo?.id,
      active: true,
      document: file,
    });

    console.log("Logo file selected:", {
      name: file.name,
      size: file.size,
      type: file.type,
      existingId: existingLogo?.id,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveLogo = () => {
    setPreviewUrl(null);
    setUploadedFile(null);
    setUploadError(null);

    // If there's an existing logo, mark it for destruction
    if (existingLogo?.id) {
      setValue("logo_attributes" as FieldPath<Company>, {
        id: existingLogo.id,
        active: false,
        _destroy: true,
      });
    } else {
      // If no existing logo, just clear the attributes
      setValue("logo_attributes" as FieldPath<Company>, {
        active: false,
        document: null,
      });
    }

    // Clean up preview URL
    if (previewUrl && uploadedFile) {
      URL.revokeObjectURL(previewUrl);
    }

    // Reset file input
    const fileInput = document.getElementById(
      "logo-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  console.log("src", previewUrl);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-red-800 text-white px-6 py-3">
        <h2 className="text-lg font-semibold">Logo Upload</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Company Logo
          </label>

          {/* Error Display */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          {/* Preview Section */}
          {previewUrl && (
            <div className="relative">
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Logo Preview
                  </h4>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Company Logo Preview"
                    className="max-h-32 max-w-full object-contain border border-gray-200 rounded"
                  />
                </div>
                {uploadedFile && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {uploadedFile.name} (
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {existingLogo?.filename && !uploadedFile && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {existingLogo.filename}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Upload Area */}
          {(!previewUrl || !isReadOnly) && (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-600 mb-2">
                {previewUrl
                  ? "Change logo:"
                  : "Drag and drop a file here or click"}
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                disabled={isReadOnly}
                onChange={handleFileChange}
              />
              <label
                htmlFor="logo-upload"
                className={`cursor-pointer text-red-600 hover:text-red-800 font-medium ${
                  isReadOnly ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Browse files
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, GIF (Max size: 5MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogoUpload;
