import React, { useState, useEffect, useRef } from "react";
import type { IpConfig } from "../../../../types/ipConfig";
import SelectBox from "../../../../components/forms/SelectBox";
import { mapToOptions } from "../../../../utils";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../../lib/axios";

interface IpConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Omit<IpConfig, "id">) => void;
  initialData?: IpConfig;
  mode: "create" | "edit" | "view";
}

const IpConfigurationModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: IpConfigurationModalProps) => {
  const { control, handleSubmit, setValue, register } = useForm<IpConfig>();

  const [sites, setSites] = useState([]);
  const hasFetched = useRef(false);

  const siteOptions = mapToOptions(sites);

  // Only fetch sites data when modal opens
  useEffect(() => {
    if (isOpen && !hasFetched.current) {
      const fetchSites = async () => {
        hasFetched.current = true;
        try {
          const resp = await axiosInstance.get("/pms/sites.json");
          const data = resp.data.sites || [];
          setSites(data);
        } catch (error) {
          console.log("Error", error);
        }
      };
      fetchSites();
    }
    if (!isOpen) {
      hasFetched.current = false;
    }
  }, [isOpen]);

  console.log("sites", sites);

  useEffect(() => {
    if (initialData && (mode === "edit" || mode === "view")) {
      setValue("pms_site_id", initialData.pms_site_id || "");
      setValue("protocol", initialData.protocol || "");
      setValue("camera_name", initialData.camera_name || "");
      setValue("user_name", initialData.user_name || "");
      setValue("password", initialData.password || "");
      setValue("ip_address", initialData.ip_address || "");
      setValue("port", initialData.port || "");
    } else if (mode === "create") {
      setValue("pms_site_id", "");
      setValue("protocol", "");
      setValue("camera_name", "");
      setValue("user_name", "");
      setValue("password", "");
      setValue("ip_address", "");
      setValue("port", "");
    }
  }, [initialData, mode, isOpen, setValue]);

  const onSubmit = (data: IpConfig) => {
    if (mode !== "view") {
      onSave(data);
      onClose();
    }
  };

  if (!isOpen) return null;

  const cameraOptions = [
    { value: "Vehicle Front Image", label: "Vehicle Front Image" },
    { value: "Vehicle Out Image", label: "Vehicle Out Image" },
    { value: "Vehicle Rear Image", label: "Vehicle Rear Image" },
    { value: "Material In Image", label: "Material In Image" },
    { value: "Material Out Image", label: "Material Out Image" },
    { value: "Challan", label: "Challan" },
  ];

  const protocolOptions = [
    { value: "http", label: "HTTP" },
    { value: "https", label: "HTTPS" },
    { value: "rtsp", label: "RTSP" },
    { value: "rtmp", label: "RTMP" },
    { value: "rtp", label: "RTP" },
  ];

  const isReadonly = mode === "view";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-red-800">
            {mode === "create" ? "Create" : mode === "edit" ? "Edit" : "View"}{" "}
            IP Configuration
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Site Dropdown */}
            <div className="space-y-2">
              <label htmlFor="pms_site_id" className="text-sm font-medium">
                Site<span className="text-red-500">*</span>
              </label>
              <SelectBox
                control={control}
                options={siteOptions}
                placeholder="Select Site"
                name="pms_site_id"
                isDisabled={isReadonly}
              />
            </div>

            {/* Protocol Dropdown */}
            <div className="space-y-2">
              <label htmlFor="protocol" className="text-sm font-medium">
                Protocol<span className="text-red-500">*</span>
              </label>
              <SelectBox
                control={control}
                options={protocolOptions}
                placeholder="Select Protocol"
                name="protocol"
                isDisabled={isReadonly}
              />
            </div>

            {/* Camera Name Dropdown */}
            <div className="space-y-2">
              <label htmlFor="camera_name" className="text-sm font-medium">
                Camera Name
              </label>
              <SelectBox
                control={control}
                options={cameraOptions}
                placeholder="Select Camera"
                name="camera_name"
                isDisabled={isReadonly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="user_name" className="text-sm font-medium">
                User Name
              </label>
              <input
                id="user_name"
                {...register("user_name")}
                placeholder="akshaymugale"
                className={`w-full p-2 border rounded focus:border-red-500 focus:ring-red-500
    ${
      isReadonly
        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
        : "border-gray-300"
    }`}
                readOnly={isReadonly}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type={mode === "view" ? "text" : "password"}
                {...register("password")}
                placeholder="xyz@1A"
                className={`w-full p-2 border rounded focus:border-red-500 focus:ring-red-500
    ${
      isReadonly
        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
        : "border-gray-300"
    }`}
                readOnly={isReadonly}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ip_address" className="text-sm font-medium">
                IP Address
              </label>
              <input
                id="ip_address"
                {...register("ip_address")}
                placeholder="192.168.29.103"
                className={`w-full p-2 border rounded focus:border-red-500 focus:ring-red-500
    ${
      isReadonly
        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
        : "border-gray-300"
    }`}
                readOnly={isReadonly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="port" className="text-sm px-2 font-medium">
              Port
            </label>
            <input
              id="port"
              {...register("port")}
              placeholder="4747"
              className={`p-2 border rounded focus:border-red-500 focus:ring-red-500
    ${
      isReadonly
        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
        : "border-gray-300"
    }`}
              readOnly={isReadonly}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                className="px-8 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default IpConfigurationModal;
