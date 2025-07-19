import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  getOrganizationById,
  createOrganization,
  updateOrganization,
} from "../../../../services/General/organizationservices";
import type { Organization } from "../../../../types/General/organization";
import { useNavigate, useParams } from "react-router-dom";
import { getGeneralDropdown } from "../../../../services/locationDropdown";
import { mapToOptions } from "../../../../utils";
import SelectBox from "../../../../components/forms/SelectBox";

type Mode = "create" | "edit" | "view";

interface OrganizationFormProps {
  id?: number;
  mode: Mode;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function OrganizationForm({ mode: propMode }: { mode?: Mode }) {
  const { id } = useParams();
  const mode = propMode || (window.location.pathname.includes("/edit")
    ? "edit"
    : window.location.pathname.includes("/view")
    ? "view"
    : "create");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Organization>();

  // Debug log to verify props
  useEffect(() => {
    console.log("Form Props:", { id, mode });
  }, [id, mode]);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  console.log("data", logoPreview)
  const [dropDown, setDropDown] = useState<any>(null);
  const navigate = useNavigate();
  const user_id = localStorage.getItem("user_id");
  const isReadOnly = mode === "view";

  // Debug log for dropdown data
  useEffect(() => {
    console.log("Dropdown Data:", dropDown);
  }, [dropDown]);
  // Watch for file changes
  const logoFile = watch("logo");

  const watchedCountryId = watch("country_id");
  const watchedStateId = watch("state_id");

  //   console.log("states", states);

  useEffect(() => {
    getGeneralDropdown().then(setDropDown);
  }, []);

  // Create options for dropdowns
  const countryOptions = mapToOptions(dropDown?.locations?.countries || []);

  // Filter states based on selected country
  const stateOptions = mapToOptions(
    dropDown?.locations?.states?.filter(
      (state: { country_id: number | null }) =>
        state.country_id === watchedCountryId
    ) || []
  );

  // Filter cities based on selected state
  const cityOptions = mapToOptions(
    dropDown?.locations?.cities?.filter(
      (city: { state_id: number }) => city.state_id === watchedStateId
    ) || []
  );
  useEffect(() => {
    if (watchedStateId) {
      // Only reset if we're not editing
      // Reset city when state changes
      reset((prev) => ({
        ...prev,
        pms_cities_id: 0,
      }));
    }
  }, [watchedStateId]);

  // Update logo preview when file is selected
  useEffect(() => {
    if (logoFile?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logoFile[0]);
    }
  }, [logoFile]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dropdown data first
        const dropdownData = await getGeneralDropdown();
        console.log("Dropdown data received:", dropdownData);
        setDropDown(dropdownData);

        // Load organization data if in edit/view mode
        if ((mode === "edit" || mode === "view") && id) {
          console.log("Fetching organization data for id:", id);
          const orgData = await getOrganizationById(Number(id));
          console.log("Organization data received:", orgData);
          console.log("Logo data:", orgData?.organization_logo?.document);
          Object.entries(orgData).forEach(([key, value]) => {
            if (value !== null) {
              setValue(key as keyof Organization, value);
            }
          });

          const logo_url =  orgData?.organization_logo?.document

          setLogoPreview(logo_url)

          // Set dropdown values after loading organization data
          if (orgData.country_id) setValue("country_id", orgData.country_id);
          if (orgData.state_id) setValue("state_id", orgData.state_id);
          if (orgData.city_id) setValue("city_id", orgData.city_id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading data");
      }
    };

    loadData();
  }, [id, mode, setValue]);

  const onSubmit = async (data: Organization) => {
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === "logo") {
          if (value instanceof FileList && value[0]) {
            formData.append("organization[logo]", value[0]);
          }
        } else if (value != null) {
          formData.append(`organization[${key}]`, value.toString());
        }
      });

      if (mode === "create") {
        formData.append("organization[active]", "1");
        if (user_id) {
          formData.append("organization[created_by_id]", user_id);
        }
        await createOrganization(formData);
        toast.success("Organization created successfully");
      } else if (mode === "edit" && id) {
        await updateOrganization(Number(id), formData);
        toast.success("Organization updated successfully");
      }
      navigate("/setup/general/organizations");
    } catch (error) {
      console.error("Error submitting organization:", error);
      toast.error("Error saving organization");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {mode === "create" ? "Create" : mode === "edit" ? "Edit" : "View"}{" "}
        Organization
      </h2>
      <div className="">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 bg-white shadow-lg border-gray-400 border rounded-md w-full max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Name*</label>
              <input
                {...register("name", { required: "Name is required" })}
                disabled={isReadOnly}
                className="border p-2 rounded w-full"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Second Row - Country and State */}
            <div>
              <label className="block mb-2 font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <SelectBox
                placeholder="Select Country"
                name="country_id"
                control={control}
                options={countryOptions}
                isDisabled={isReadOnly}
              />
              {errors.country_id && (
                <span className="text-red-500 text-sm mt-1 block">
                  Country is required
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">
                State <span className="text-red-500">*</span>
              </label>
              <SelectBox
                placeholder="Select State"
                name="state_id"
                control={control}
                options={stateOptions}
                isDisabled={isReadOnly || !watchedCountryId}
              />
              {errors.state_id && (
                <span className="text-red-500 text-sm mt-1 block">
                  State is required
                </span>
              )}
            </div>

            {/* Third Row - City */}
            <div>
              <label className="block mb-2 font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <SelectBox
                placeholder="Select City"
                name="city_id"
                control={control}
                options={cityOptions}
                isDisabled={isReadOnly || !watchedStateId}
              />
              {errors.city_id && (
                <span className="text-red-500 text-sm mt-1 block">
                  City is required
                </span>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium mb-1">Address*</label>
              <input
                {...register("address_line", {
                  required: "Address is required",
                })}
                disabled={isReadOnly}
                className="border p-2 rounded w-full"
              />
              {errors.address_line && (
                <p className="text-red-600 text-sm">
                  {errors.address_line.message}
                </p>
              )}
            </div>

            {/* Pin Code */}
            <div>
              <label className="block font-medium mb-1">Pin Code*</label>
              <input
                {...register("pin_code", { required: "Pin code is required" })}
                disabled={isReadOnly}
                className="border p-2 rounded w-full"
              />
              {errors.pin_code && (
                <p className="text-red-600 text-sm">
                  {errors.pin_code.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-medium mb-1">Phone Number*</label>
              <input
                {...register("phone_no", {
                  required: "Phone number is required",
                })}
                disabled={isReadOnly}
                className="border p-2 rounded w-full"
              />
              {errors.phone_no && (
                <p className="text-red-600 text-sm">
                  {errors.phone_no.message}
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-medium mb-1">Mobile Number*</label>
              <input
                {...register("mobile_no", {
                  required: "Mobile number is required",
                })}
                disabled={isReadOnly}
                className="border p-2 rounded w-full"
              />
              {errors.mobile_no && (
                <p className="text-red-600 text-sm">
                  {errors.mobile_no.message}
                </p>
              )}
            </div>
            {/* Logo */}
            <div className="mb-2">
              <label className="block font-medium mb-1">Logo*</label>
              {!isReadOnly && (
                <input
                  type="file"
                  accept="image/*"
                  {...register("logo")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="border p-2 rounded w-full"
                />
              )}
              {/* Show either uploaded preview or existing logo */}
              <div className="mt-2">
                <img
                  src={
                    logoPreview ||
                    ""
                  }
                  alt="Logo Preview"
                  className="w-28 h-20 object-cover rounded"
                  onError={(e) => {
                    console.log("Error loading image");
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              type="button"
              onClick={() => navigate("/setup/general/organizations")}
              className="border purple-btn1 border-red-800 text-red-800 px-4 py-2 rounded"
            >
              Cancel
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="bg-red-800 purple-btn2 text-white px-4 py-2 rounded"
              >
                {mode === "create" ? "Create" : "Update"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
