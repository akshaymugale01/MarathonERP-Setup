import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Company } from "../../../../types/General/companies";
import { getGeneralDropdown } from "../../../../services/locationDropdown";
import { getCompanyById } from "../../../../services/General/companyServices";
import { mapToOptions } from "../../../../utils";
import currenciesData from "../../../../utils/currencies.json";

// Import components
import CompanyBasicInfo from "./components/CompanyBasicInfo";
import CompanyOfficeAddress from "./components/CompanyOfficeAddress";
import CompanyBillingAddress from "./components/CompanyBillingAddress";
import CompanyPayrollInfo from "./components/CompanyPayrollInfo";
import CompanyConfigurations from "./components/CompanyConfigurations";
import CompanyGSTIN from "./components/CompanyGSTIN";
import CompanyFormActions from "./components/CompanyFormActions";

interface CompanyFormProps {
  mode: "create" | "edit" | "view";
  companyId?: number; // Add ID prop for edit/view modes
  initialData?: Company | Record<string, unknown>;
  onSave?: (data: Record<string, unknown>) => void;
  onCancel?: () => void;
}

interface GSTINEntry {
  id: string;
  gstin: string;
  address: string;
  pin_code: string;
  pms_state_id: string;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  mode = "create",
  companyId,
  initialData,
  onSave,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [gstinEntries, setGstinEntries] = useState<GSTINEntry[]>([]);
  const [companyData, setCompanyData] = useState<Company | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Company>();

  // Type for dropdown data
  interface DropdownData {
    locations?: {
      organizations?: Array<{ id: number; name: string }>;
      countries?: Array<{ id: number; name: string }>;
      states?: Array<{ id: number; name: string; country_id: number }>;
      cities?: Array<{ id: number; name: string; state_id: number }>;
      locations?: Array<{ id: number; name: string; city_id: number }>;
    };
  }

  const [dropDown, setDropDown] = useState<DropdownData>({});

  useEffect(() => {
    getGeneralDropdown().then(setDropDown);
  }, []);

  // Fetch company data for edit/view mode
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && companyId) {
      setIsLoading(true);
      getCompanyById(companyId)
        .then((company) => {
          setCompanyData(company);
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
          setSubmitError({
            general: ["Failed to load company data"],
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [mode, companyId]); // Populate form with initial data for edit/view mode
  useEffect(() => {
    // Use fetched data if available, otherwise use passed initialData
    const dataToUse = companyData || initialData;

    if (dataToUse && (mode === "edit" || mode === "view")) {
      console.log("Setting initial data:", dataToUse);

      // Reset form first to clear any existing values
      reset();

      // Cast to allow access to backend data structure
      const data = dataToUse as Company & Record<string, unknown>;

      // Set form values using the reset function with default values
      const formData = {
        // Direct fields
        company_name: data.company_name || "",
        company_code: data.company_code || "",
        fiscal_year_from: data.fiscal_year_from || "",
        fiscal_year_to: data.fiscal_year_to || "",
        company_print_name: data.company_print_name || "",
        domain_name: data.domain_name || "",
        email: data.email || "",
        server_host: data.server_host || "",
        accounting_package: data.accounting_package || "",
        corporate_identity_no: data.corporate_identity_no || "",
        tax_deduction_acc_no: data.tax_deduction_acc_no || "",
        service_tax_no: data.service_tax_no || "",
        pan_number: data.pan_number || "",
        vat_no: data.vat_no || "",
        type_of_organization_id: data.type_of_organization_id || 0,
        currency: data.currency || "",
        contact_person_name: data.contact_person_name || "",
        contact_number: data.contact_number || "",

        // Payroll fields
        tan_no: data.tan_no || "",
        pf_no: data.pf_no || "",
        esi_no: data.esi_no || "",
        salary_calculation: data.salary_calculation || "",
        days: data.days || 0,
        start_days: data.start_days || 0,

        // Nested office address attributes
        office_address_attributes: {
          id: data.office_address?.id || "",
          address: data.office_address?.address || "",
          address_line_two: data.office_address?.address_line_two || "",
          pms_country_id: data.office_address?.pms_country_id || 0,
          pms_state_id: data.office_address?.pms_state_id || 0,
          pms_city_id: data.office_address?.pms_city_id || 0,
          pms_location_id: data.office_address?.pms_location_id || 0,
          pin_code: data.office_address?.pin_code || "",
          telephone_number: data.office_address?.telephone_number || "",
          fax_number: data.office_address?.fax_number || "",
          address_type: "office",
        },

        // Nested billing address attributes
        billing_address_attributes: {
          id: data.billing_address?.id || "",
          address: data.billing_address?.address || "",
          address_line_two: data.billing_address?.address_line_two || "",
          pms_country_id: data.billing_address?.pms_country_id || 0,
          pms_state_id: data.billing_address?.pms_state_id || 0,
          pms_city_id: data.billing_address?.pms_city_id || 0,
          pms_location_id: data.billing_address?.pms_location_id || 0,
          pin_code: data.billing_address?.pin_code || "",
          telephone_number: data.billing_address?.telephone_number || "",
          fax_number: data.billing_address?.fax_number || "",
          address_type: "billing",
        },

        // Boolean fields - convert from backend format
        same_as_above_address: Boolean(
          String(data.same_as_above_address) === "1" ||
            data.same_as_above_address === true
        ),
        pf_applicable: Boolean(
          String(data.pf_applicable) === "1" || data.pf_applicable === true
        ),
        esi_applicable: Boolean(
          String(data.esi_applicable) === "1" || data.esi_applicable === true
        ),
        mor_selection_enabled: Boolean(
          String(data.mor_selection_enabled) === "1" ||
            data.mor_selection_enabled === true
        ),
        material_selection_enabled: Boolean(
          String(data.material_selection_enabled) === "1" ||
            data.material_selection_enabled === true
        ),
        service_selection_enabled: Boolean(
          String(data.service_selection_enabled) === "1" ||
            data.service_selection_enabled === true
        ),
        sor_selection_enabled: Boolean(
          String(data.sor_selection_enabled) === "1" ||
            data.sor_selection_enabled === true
        ),
      };

      // Reset form with the prepared data
      reset(formData as Partial<Company>);

      // Set GSTIN entries separately - FIX THE GSTIN POPULATION WITH PROPER STATE ID
      console.log("Raw GSTIN data:", data.company_gstin_details);

      if (
        data.company_gstin_details &&
        Array.isArray(data.company_gstin_details)
      ) {
        const gstinEntries = data.company_gstin_details.map(
          (
            item: {
              id?: string | number;
              gstin?: string;
              address?: string;
              pin_code?: string;
              pms_state_id?: string | number;
            },
            index: number
          ) => {
            console.log(`Processing GSTIN entry ${index}:`, item);

            const entry = {
              id: item.id?.toString() || `temp_${index}`,
              gstin: item.gstin || "",
              address: item.address || "",
              pin_code: item.pin_code || "",
              pms_state_id: item.pms_state_id
                ? item.pms_state_id.toString()
                : "", // Keep as string for form
            };

            console.log(`Mapped GSTIN entry ${index}:`, entry);
            return entry;
          }
        );

        console.log("Final GSTIN entries:", gstinEntries);
        setGstinEntries(gstinEntries);

        // Also register the GSTIN fields with React Hook Form - FIX THE STATE ID VALUE
        gstinEntries.forEach((entry, index) => {
          setValue(
            `company_gstin_details_attributes.${index}.gstin`,
            entry.gstin
          );
          setValue(
            `company_gstin_details_attributes.${index}.address`,
            entry.address
          );
          setValue(
            `company_gstin_details_attributes.${index}.pin_code`,
            entry.pin_code
          );
          // Set the state ID as number for the SelectBox to match properly
          setValue(
            `company_gstin_details_attributes.${index}.pms_state_id`,
            parseInt(entry.pms_state_id) || 0
          );
        });
      } else {
        console.log("No GSTIN details found or not an array");
        setGstinEntries([]);
      }
    }
  }, [companyData, initialData, mode, reset, setValue]);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Live Values", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    console.log("CompanyForm props:", { mode, companyId, initialData });
    console.log("CompanyForm initialData type:", typeof initialData);
    console.log(
      "CompanyForm initialData keys:",
      initialData ? Object.keys(initialData) : "N/A"
    );
  }, [mode, companyId, initialData]);

  console.log("General Drop down", dropDown);

  // Watch specific fields with proper typing
  const watchedCountryId = watch("office_address_attributes.pms_country_id");
  const watchedStateId = watch("office_address_attributes.pms_state_id");
  const watchedCityId = watch("office_address_attributes.pms_city_id");
  const watchedCIN = watch("corporate_identity_no");
  const watchedTaxDA = watch("tax_deduction_acc_no");
  const watchedPAN = watch("pan_number");
  const watchedVAT = watch("vat_no");
  const watchedTAN = watch("tan_no");
  const watchedPF = watch("pf_no");
  const watchedESI = watch("esi_no");
  const watchedContactNumber = watch("contact_number");

  const watchedSameAsOfficeAddress = watch("same_as_above_address");
  const watchedOfficeAddress = watch("office_address_attributes.address");
  const watchedOfficeAddressLineTwo = watch(
    "office_address_attributes.address_line_two"
  );
  const watchedOfficePinCode = watch("office_address_attributes.pin_code");
  const watchedOfficeTelephone = watch(
    "office_address_attributes.telephone_number"
  );
  const watchedOfficeFax = watch("office_address_attributes.fax_number");
  const watchedOfficeLocation = watch(
    "office_address_attributes.pms_location_id"
  );

  useEffect(() => {
    if (watchedSameAsOfficeAddress) {
      setValue(
        "billing_address_attributes.address",
        watchedOfficeAddress || ""
      );
      setValue(
        "billing_address_attributes.address_line_two",
        watchedOfficeAddressLineTwo || ""
      );
      setValue(
        "billing_address_attributes.pms_country_id",
        watchedCountryId || 0
      );
      setValue("billing_address_attributes.pms_state_id", watchedStateId || 0);
      setValue("billing_address_attributes.pms_city_id", watchedCityId || 0);
      setValue(
        "billing_address_attributes.pin_code",
        watchedOfficePinCode || ""
      );
      setValue(
        "billing_address_attributes.telephone_number",
        watchedOfficeTelephone || ""
      );
      setValue("billing_address_attributes.fax_number", watchedOfficeFax || "");
      setValue(
        "billing_address_attributes.pms_location_id",
        watchedOfficeLocation || 0
      );
    }
  }, [
    watchedSameAsOfficeAddress,
    watchedOfficeAddress,
    watchedOfficeAddressLineTwo,
    watchedCountryId,
    watchedStateId,
    watchedCityId,
    watchedOfficePinCode,
    watchedOfficeTelephone,
    watchedOfficeFax,
    watchedOfficeLocation,
    setValue,
  ]);

  // Trigger validation for fields on change
  useEffect(() => {
    if (watchedCIN && String(watchedCIN).length > 0) {
      trigger("corporate_identity_no");
    }
  }, [watchedCIN, trigger]);

  useEffect(() => {
    if (watchedTaxDA && String(watchedTaxDA).length > 0) {
      trigger("tax_deduction_acc_no");
    }
  }, [watchedTaxDA, trigger]);

  useEffect(() => {
    if (watchedPAN && String(watchedPAN).length > 0) {
      trigger("pan_number");
    }
  }, [watchedPAN, trigger]);

  useEffect(() => {
    if (watchedVAT && String(watchedVAT).length > 0) {
      trigger("vat_no");
    }
  }, [watchedVAT, trigger]);

  useEffect(() => {
    if (watchedTAN && String(watchedTAN).length > 0) {
      trigger("tan_no");
    }
  }, [watchedTAN, trigger]);

  useEffect(() => {
    if (watchedPF && String(watchedPF).length > 0) {
      trigger("pf_no");
    }
  }, [watchedPF, trigger]);

  useEffect(() => {
    if (watchedESI && String(watchedESI).length > 0) {
      trigger("esi_no");
    }
  }, [watchedESI, trigger]);

  useEffect(() => {
    if (watchedContactNumber && String(watchedContactNumber).length > 0) {
      trigger("contact_number");
    }
  }, [watchedContactNumber, trigger]);

  const orgOptions = mapToOptions(dropDown?.locations?.organizations || []);

  const currencyOptions = currenciesData.map((currency) => ({
    value: currency.cc,
    label: `${currency.cc} - ${currency.name} (${currency.symbol})`,
  }));

  const countryOptions = mapToOptions(dropDown?.locations?.countries || []);

  const allStateOptions = mapToOptions(dropDown?.locations?.states || []);
  const stateOptions = mapToOptions(
    dropDown?.locations?.states?.filter(
      (state) => state.country_id === watchedCountryId
    ) || []
  );

  const cityOptions = mapToOptions(
    dropDown?.locations?.cities?.filter(
      (city) => city.state_id === watchedStateId
    ) || []
  );

  const locationOptions = mapToOptions(
    dropDown?.locations?.locations?.filter(
      (loc) => loc.city_id === watchedCityId
    ) || []
  );

  console.log("location", locationOptions);

  const accountingOptions = [
    { value: "tally", label: "Tally" },
    { value: "quickbooks", label: "QuickBooks" },
    { value: "sap", label: "SAP" },
    { value: "oracle", label: "Oracle" },
    { value: "other", label: "Other" },
  ];

  // Clear error when form data changes and auto-save to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      if (submitError) {
        setSubmitError(null);
      }

      // Simple localStorage backup for create mode only (no complex debouncing)
      if (mode === "create" && value) {
        try {
          const dataToSave = {
            ...value,
            company_gstin_details_attributes: gstinEntries,
          };
          localStorage.setItem("companyFormData", JSON.stringify(dataToSave));
        } catch (error) {
          console.error("Error saving to localStorage:", error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, submitError, mode, gstinEntries]);

  const isReadOnly = mode === "view";

  // Functions for GSTIN management
  const addGSTINEntry = () => {
    const newIndex = gstinEntries.length;
    const newEntry: GSTINEntry = {
      id: `temp_${Date.now()}_${newIndex}`, // Use timestamp to make it unique
      gstin: "",
      address: "",
      pin_code: "",
      pms_state_id: "",
    };

    const newEntries = [...gstinEntries, newEntry];
    setGstinEntries(newEntries);

    // Register the new fields with React Hook Form
    setTimeout(() => {
      setValue(`company_gstin_details_attributes.${newIndex}.gstin`, "");
      setValue(`company_gstin_details_attributes.${newIndex}.address`, "");
      setValue(`company_gstin_details_attributes.${newIndex}.pin_code`, "");
      setValue(`company_gstin_details_attributes.${newIndex}.pms_state_id`, 0);
    }, 100);
  };

  const removeGSTINEntry = (idToRemove: string) => {
    setGstinEntries((prevEntries) => {
      const filteredEntries = prevEntries.filter(
        (entry) => entry.id !== idToRemove
      );

      // Re-register all remaining entries with correct indices after a short delay
      setTimeout(() => {
        filteredEntries.forEach((entry, index) => {
          setValue(
            `company_gstin_details_attributes.${index}.gstin`,
            entry.gstin
          );
          setValue(
            `company_gstin_details_attributes.${index}.address`,
            entry.address
          );
          setValue(
            `company_gstin_details_attributes.${index}.pin_code`,
            entry.pin_code
          );
          setValue(
            `company_gstin_details_attributes.${index}.pms_state_id`,
            entry.pms_state_id ? parseInt(entry.pms_state_id) : 0
          );
        });

        // Clear any remaining higher-indexed fields
        for (let i = filteredEntries.length; i < prevEntries.length; i++) {
          setValue(`company_gstin_details_attributes.${i}.gstin`, "");
          setValue(`company_gstin_details_attributes.${i}.address`, "");
          setValue(`company_gstin_details_attributes.${i}.pin_code`, "");
          setValue(`company_gstin_details_attributes.${i}.pms_state_id`, 0);
        }
      }, 100);

      return filteredEntries;
    });
  };

  // Form submission handler using React Hook Form
  const onSubmit = async (data: Company) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Only include GSTIN entries if there are actual entries with data
      const validGstinEntries = gstinEntries.filter(
        (entry) =>
          entry.gstin.trim() !== "" ||
          entry.address.trim() !== "" ||
          entry.pin_code.trim() !== "" ||
          entry.pms_state_id !== ""
      );

      // Prepare GSTIN entries for submission only if there are valid entries
      const gstinAttributes =
        validGstinEntries.length > 0
          ? validGstinEntries.map((entry, index) => ({
              id:
                entry.id && entry.id !== `temp_${index}` ? entry.id : undefined,
              gstin: entry.gstin,
              address: entry.address,
              pin_code: entry.pin_code,
              pms_state_id: entry.pms_state_id
                ? parseInt(entry.pms_state_id)
                : undefined,
              _destroy: false, // Ensure we're not destroying existing entries
            }))
          : [];

      const completeFormData = {
        ...data,
        // Only include GSTIN attributes if there are valid entries
        ...(gstinAttributes.length > 0 && {
          company_gstin_details_attributes: gstinAttributes,
        }),
      };

      console.log("Submitting form data:", completeFormData);
      console.log("Valid GSTIN entries:", validGstinEntries);

      await Promise.resolve(
        onSave?.(completeFormData as Record<string, unknown>)
      );
      console.log("Company data saved successfully:", completeFormData);

      if (mode === "create") {
        reset();
        setGstinEntries([]);
        localStorage.removeItem("companyFormData");
      }
    } catch (error: unknown) {
      console.error("Error saving company data:", error);

      // Attempt to get response errors from the backend
      const errorResponse = error as {
        response?: { data?: Record<string, string[]> };
        data?: Record<string, string[]>;
      };
      const errorData = errorResponse?.response?.data || errorResponse?.data;

      if (errorData && typeof errorData === "object") {
        setSubmitError(errorData); // Save the full error object
      } else {
        setSubmitError({
          general: ["An error occurred while saving the company data"],
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (mode === "create") {
      localStorage.removeItem("companyFormData");
    }
    onCancel?.();
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading company data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "create"
            ? "Create Company"
            : mode === "edit"
            ? "Edit Company"
            : "View Company"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Certifying Company</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_name"
                  type="text"
                  {...register("company_name", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter company name"
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs mt-1">
                    Company name is required
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="companyCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_code"
                  type="text"
                  {...register("company_code", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter company name"
                />
                {errors.company_code && (
                  <p className="text-red-500 text-xs mt-1">
                    Company Code is required
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fiscalYearFrom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fiscal Year From <span className="text-red-500">*</span>
                </label>
                <input
                  id="fiscal_year_from"
                  type="date"
                  {...register("fiscal_year_from", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                />
                {errors.fiscal_year_from && (
                  <p className="text-red-500 text-xs mt-1">Select Date</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fiscalYearTo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fiscal Year To <span className="text-red-500">*</span>
                </label>
                <input
                  id="fiscal_year_to"
                  type="date"
                  {...register("fiscal_year_to", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                />
                {errors.fiscal_year_to && (
                  <p className="text-red-500 text-xs mt-1">Select Date</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="company_print_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company Print Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="company_print_name"
                  type="text"
                  {...register("company_print_name", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter company print name"
                />
                {errors.company_print_name && (
                  <p className="text-red-500 text-xs mt-1">
                    Company print name is required
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="domain_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Domain Name
                </label>
                <input
                  id="domain_name"
                  type="text"
                  {...register("domain_name")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter domain name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="server_host"
                  className="block text-sm font-medium text-gray-700"
                >
                  Server Host (IP Address)
                </label>
                <input
                  id="server_host"
                  type="text"
                  {...register("server_host")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter server host"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accountingPackage"
                  className="block text-sm font-medium text-gray-700"
                >
                  Accounting Package <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="accounting_package"
                  control={control}
                  options={accountingOptions}
                  placeholder="Select Accounting"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="corporate_identity_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Corporate Identity No(CIN){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="corporate_identity_no"
                  type="text"
                  {...register("corporate_identity_no", {
                    required: "Corporate identity number is required",
                    pattern: {
                      value: /^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
                      message:
                        "Corporate identity no must be in the format L17110MH1973PLC019786",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter corporate identity number (e.g., L17110MH1973PLC019786)"
                />
                {errors.corporate_identity_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.corporate_identity_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tax_deduction_acc_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tax Deduction Acc No <span className="text-red-500">*</span>
                </label>
                <input
                  id="tax_deduction_acc_no"
                  type="text"
                  {...register("tax_deduction_acc_no", {
                    required: "Tax deduction account number is required",
                    pattern: {
                      value: /^[A-Z]{4}\d{5}[A-Z]$/,
                      message:
                        "Tax deduction acc no is not in the correct format. It should be in the format: AAAA12345A.",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter tax deduction account number (e.g., DELH12345A)"
                />
                {errors.tax_deduction_acc_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tax_deduction_acc_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="service_tax_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Tax No
                </label>
                <input
                  id="service_tax_no"
                  type="text"
                  {...register("service_tax_no")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter service tax number"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pan_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  PAN No <span className="text-red-500">*</span>
                </label>
                <input
                  id="pan_number"
                  type="text"
                  {...register("pan_number", {
                    required: "PAN number is required",
                    pattern: {
                      value: /^[A-Z]{5}\d{4}[A-Z]$/,
                      message:
                        "Pan number is invalid. It should be in the format ABCDE1234F.",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter PAN number (e.g., ABCDE1234F)"
                />
                {errors.pan_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pan_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="vat_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  VAT No
                </label>
                <input
                  id="vat_no"
                  type="text"
                  {...register("vat_no", {
                    pattern: {
                      value: /^IE\d{7}T[W]?$/,
                      message:
                        "Vat no must be in the format IE1234567T or IE1234567TW",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter VAT number (e.g., IE1234567T or IE1234567TW)"
                />
                {errors.vat_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.vat_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="type_of_organization_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Constitution Type <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="type_of_organization_id"
                  options={orgOptions}
                  control={control}
                  placeholder="Select Constitution"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700"
                >
                  Currency <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="currency"
                  control={control}
                  options={currencyOptions}
                  placeholder="Select Currency"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact_person_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact_person_name"
                  type="text"
                  {...register("contact_person_name", { required: true })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter contact person name"
                />
                {errors.contact_person_name && (
                  <p className="text-red-500 text-xs mt-1">
                    Contact person name is required
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="contact_number"
                  type="text"
                  {...register("contact_number", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Contact number must be exactly 10 digits",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                  placeholder="Enter 10-digit contact number"
                />
                {errors.contact_number && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contact_number.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Registered Office Address Details */}
        <div className="bg-white rounded-xl shadow-md border mt-5 border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">
              Registered Office Address Details
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("office_address_attributes.address", {
                    required: true,
                  })}
                  placeholder="Enter address line 1"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Line 2 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("office_address_attributes.address_line_two", {
                    required: true,
                  })}
                  placeholder="Enter address line 2"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="office_address_attributes.pms_country_id"
                  options={countryOptions}
                  control={control}
                  placeholder="Select Country"
                />
              </div>

              <div className="space-y-2">
                <label className="block mb-2 font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select State"
                  name="office_address_attributes.pms_state_id"
                  control={control}
                  options={stateOptions}
                  isDisabled={!watchedCountryId}
                />
                {errors.state && (
                  <span className="text-red-500 text-sm mt-1 block">
                    State is required
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block mb-2 font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  placeholder="Select City"
                  name="office_address_attributes.pms_city_id"
                  control={control}
                  options={cityOptions}
                  isDisabled={!watchedStateId}
                />
                {errors.city && (
                  <span className="text-red-500 text-sm mt-1 block">
                    City is required
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="pinZip"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin/Zip <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("office_address_attributes.pin_code", {
                    required: true,
                  })}
                  placeholder="Enter pin code"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telephone
                </label>
                <input
                  {...register("office_address_attributes.telephone_number")}
                  placeholder="Enter telephone number"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fax
                </label>
                <input
                  {...register("office_address_attributes.fax_number")}
                  placeholder="Enter fax number"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly}
                />
              </div>

              <div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <SelectBox
                    name="office_address_attributes.pms_location_id"
                    placeholder="Select Location"
                    control={control}
                    options={locationOptions}
                    isDisabled={!watchedCityId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Address Details */}
        <div className="bg-white rounded-xl shadow-md mt-5 border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Billing Address Details</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  id="same_as_above_address"
                  type="checkbox"
                  {...register("same_as_above_address")}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="same_as_above_address"
                  className="text-sm font-medium text-gray-700"
                >
                  Same as Office Address
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="billing_address_line1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("billing_address_attributes.address", {
                    required: true,
                  })}
                  placeholder="Enter billing address line 1"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_address_line2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Line 2
                </label>
                <input
                  {...register("billing_address_attributes.address_line_two")}
                  placeholder="Enter billing address line 2"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_country"
                  className="block text-sm font-medium text-gray-700"
                >
                  Country <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="billing_address_attributes.pms_country_id"
                  options={countryOptions}
                  control={control}
                  placeholder="Select Country"
                  isDisabled={Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State/Province <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="billing_address_attributes.pms_state_id"
                  options={stateOptions}
                  control={control}
                  placeholder="Select State"
                  isDisabled={Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="billing_address_attributes.pms_city_id"
                  options={cityOptions}
                  control={control}
                  placeholder="Select City"
                  isDisabled={Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_pin_zip"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin/Zip <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("billing_address_attributes.pin_code", {
                    required: true,
                  })}
                  placeholder="Enter pin code"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_telephone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telephone
                </label>
                <input
                  {...register("billing_address_attributes.telephone_number")}
                  placeholder="Enter telephone number"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_fax"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fax
                </label>
                <input
                  {...register("billing_address_attributes.fax_number")}
                  placeholder="Enter fax number"
                  className="w-full border px-3 py-2 rounded-md"
                  readOnly={isReadOnly || Boolean(watchedSameAsOfficeAddress)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="billing_location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <SelectBox
                  name="billing_address_attributes.pms_location_id"
                  options={locationOptions}
                  control={control}
                  placeholder="Select Location"
                  isDisabled={Boolean(watchedSameAsOfficeAddress)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Information */}
        <div className="bg-white rounded-xl mt-5 shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Payroll Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="tan_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  TAN No
                </label>
                <input
                  id="tan_no"
                  type="text"
                  {...register("tan_no", {
                    pattern: {
                      value: /^[A-Z]{4}\d{5}[A-Z]$/,
                      message: "Tan no must be in the format RAJA99999B",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter TAN number (e.g., RAJA99999B)"
                />
                {errors.tan_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tan_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    id="pf_applicable"
                    type="checkbox"
                    {...register("pf_applicable")}
                    disabled={isReadOnly}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="pf_applicable"
                    className="text-sm font-medium text-gray-700"
                  >
                    PF Applicable
                  </label>
                </div>
                <label
                  htmlFor="pf_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  PF No
                </label>
                <input
                  id="pf_no"
                  type="text"
                  {...register("pf_no", {
                    pattern: {
                      value: /^[A-Z0-9]{22}$/,
                      message:
                        "Pf no must be a 22-character alphanumeric code (e.g., TNMAS00451230000012345)",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter PF number (e.g., TNMAS00451230000012345)"
                />
                {errors.pf_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.pf_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    id="esi_applicable"
                    type="checkbox"
                    {...register("esi_applicable")}
                    disabled={isReadOnly}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label
                    htmlFor="esi_applicable"
                    className="text-sm font-medium text-gray-700"
                  >
                    ESI Applicable
                  </label>
                </div>
                <label
                  htmlFor="esi_no"
                  className="block text-sm font-medium text-gray-700"
                >
                  ESI No
                </label>
                <input
                  id="esi_no"
                  type="text"
                  {...register("esi_no", {
                    pattern: {
                      value: /^\d{17}$/,
                      message:
                        "Esi no must be a 17-digit number (e.g., 12345678901234567)",
                    },
                  })}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter ESI number (e.g., 12345678901234567)"
                />
                {errors.esi_no && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.esi_no.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="salary_calculation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Salary Calculation
                </label>
                <input
                  id="salary_calculation"
                  type="text"
                  {...register("salary_calculation")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter salary calculation"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="days"
                  className="block text-sm font-medium text-gray-700"
                >
                  Days
                </label>
                <input
                  id="days"
                  type="number"
                  {...register("days")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter days"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="start_days"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Day
                </label>
                <input
                  id="start_days"
                  type="number"
                  {...register("start_days")}
                  readOnly={isReadOnly}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter start day"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Configurations */}
        <div className="bg-white rounded-xl mt-5 shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Configurations</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  id="mor_selection_enabled"
                  type="checkbox"
                  {...register("mor_selection_enabled")}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="mor_selection_enabled"
                  className="text-sm font-medium"
                >
                  Enable MOR selection
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="material_selection_enabled"
                  type="checkbox"
                  {...register("material_selection_enabled")}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="material_selection_enabled"
                  className="text-sm font-medium"
                >
                  Enable Material selection
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="service_selection_enabled"
                  type="checkbox"
                  {...register("service_selection_enabled")}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="service_selection_enabled"
                  className="text-sm font-medium"
                >
                  Enable Service selection
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="sor_selection_enabled"
                  type="checkbox"
                  {...register("sor_selection_enabled")}
                  disabled={isReadOnly}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="sor_selection_enabled"
                  className="text-sm font-medium"
                >
                  Enable SOR selection
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* State wise GSTIN */}
        <div className="bg-white rounded-xl mt-5 shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">State wise GSTIN</h2>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addGSTINEntry}
                className="px-4 py-2 bg-white text-red-800 border border-red-800 rounded-md hover:bg-red-50"
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
            {gstinEntries.length > 0 && (
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
                    {gstinEntries.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="px-4 py-3">
                          <SelectBox
                            name={`company_gstin_details_attributes.${index}.pms_state_id`}
                            control={control}
                            options={allStateOptions}
                            placeholder="Select GST State"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(
                              `company_gstin_details_attributes.${index}.gstin`
                            )}
                            readOnly={isReadOnly}
                            className="w-full border px-3 py-2"
                            placeholder="Enter GSTIN"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <textarea
                            {...register(
                              `company_gstin_details_attributes.${index}.address`
                            )}
                            readOnly={isReadOnly}
                            className="w-full border px-3 py-2"
                            placeholder="Enter address"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            {...register(
                              `company_gstin_details_attributes.${index}.pin_code`
                            )}
                            readOnly={isReadOnly}
                            className="w-full border px-3 py-2"
                            placeholder="Enter pin code"
                          />
                        </td>
                        {!isReadOnly && (
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removeGSTINEntry(entry.id)}
                              className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
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

            {gstinEntries.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No GSTIN entries added yet.</p>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={addGSTINEntry}
                    className="mt-4 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
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

        {/* Logo Upload */}
        <div className="bg-white rounded-xl mt-5 shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-red-800 text-white px-6 py-3">
            <h2 className="text-lg font-semibold">Logo Upload</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium">Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9 7 9-7M4 7h16"
                  />
                </svg>
                <p className="text-gray-600 mb-2">
                  Drag and drop a file here or click
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="logo-upload"
                  disabled={isReadOnly}
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer text-blue-600 hover:text-blue-800 ${
                    isReadOnly ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  Browse files
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error saving company data
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {Object.entries(submitError).map(([field, errors]) => (
                    <div key={field} className="mb-2">
                      <strong className="capitalize">
                        {field.replace(/_/g, " ")}:
                      </strong>
                      <ul className="list-disc list-inside ml-4">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-8 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-red-800 hover:bg-red-900 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{isSubmitting ? "Saving..." : "Save"}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyForm;
