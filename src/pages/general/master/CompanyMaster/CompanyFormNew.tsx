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
  companyId?: number;
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
  const [submitError, setSubmitError] = useState<Record<string, string[]> | null>(null);
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
  }, [mode, companyId]);

  // Populate form with initial data for edit/view mode
  useEffect(() => {
    const dataToUse = companyData || initialData;

    if (dataToUse && (mode === "edit" || mode === "view")) {
      console.log("Setting initial data:", dataToUse);
      reset();

      const data = dataToUse as Company & Record<string, unknown>;

      // Set form values
      const formData = {
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
        tan_no: data.tan_no || "",
        pf_no: data.pf_no || "",
        esi_no: data.esi_no || "",
        salary_calculation: data.salary_calculation || "",
        days: data.days || 0,
        start_days: data.start_days || 0,
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

      reset(formData as Partial<Company>);

      // Set GSTIN entries
      if (data.company_gstin_details && Array.isArray(data.company_gstin_details)) {
        const gstinEntries = data.company_gstin_details.map(
          (item: { id?: string | number; gstin?: string; address?: string; pin_code?: string; pms_state_id?: string | number }, index: number) => ({
            id: item.id?.toString() || `temp_${index}`,
            gstin: item.gstin || "",
            address: item.address || "",
            pin_code: item.pin_code || "",
            pms_state_id: item.pms_state_id ? item.pms_state_id.toString() : "",
          })
        );

        setGstinEntries(gstinEntries);

        gstinEntries.forEach((entry, index) => {
          setValue(`company_gstin_details_attributes.${index}.gstin`, entry.gstin);
          setValue(`company_gstin_details_attributes.${index}.address`, entry.address);
          setValue(`company_gstin_details_attributes.${index}.pin_code`, entry.pin_code);
          setValue(`company_gstin_details_attributes.${index}.pms_state_id`, parseInt(entry.pms_state_id) || 0);
        });
      } else {
        setGstinEntries([]);
      }
    }
  }, [companyData, initialData, mode, reset, setValue]);

  // Watch specific fields
  const watchedCountryId = watch("office_address_attributes.pms_country_id");
  const watchedStateId = watch("office_address_attributes.pms_state_id");
  const watchedCityId = watch("office_address_attributes.pms_city_id");
  const watchedSameAsOfficeAddress = watch("same_as_above_address");
  const watchedOfficeAddress = watch("office_address_attributes.address");
  const watchedOfficeAddressLineTwo = watch("office_address_attributes.address_line_two");
  const watchedOfficePinCode = watch("office_address_attributes.pin_code");
  const watchedOfficeTelephone = watch("office_address_attributes.telephone_number");
  const watchedOfficeFax = watch("office_address_attributes.fax_number");
  const watchedOfficeLocation = watch("office_address_attributes.pms_location_id");

  // Auto-fill billing address when "same as office" is checked
  useEffect(() => {
    if (watchedSameAsOfficeAddress) {
      setValue("billing_address_attributes.address", watchedOfficeAddress || "");
      setValue("billing_address_attributes.address_line_two", watchedOfficeAddressLineTwo || "");
      setValue("billing_address_attributes.pms_country_id", watchedCountryId || 0);
      setValue("billing_address_attributes.pms_state_id", watchedStateId || 0);
      setValue("billing_address_attributes.pms_city_id", watchedCityId || 0);
      setValue("billing_address_attributes.pin_code", watchedOfficePinCode || "");
      setValue("billing_address_attributes.telephone_number", watchedOfficeTelephone || "");
      setValue("billing_address_attributes.fax_number", watchedOfficeFax || "");
      setValue("billing_address_attributes.pms_location_id", watchedOfficeLocation || 0);
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

  // Clear error when form data changes
  useEffect(() => {
    const subscription = watch((value) => {
      if (submitError) {
        setSubmitError(null);
      }

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

  // Prepare dropdown options
  const orgOptions = mapToOptions(dropDown?.locations?.organizations || []) as Array<{ value: number; label: string }>;
  const currencyOptions = currenciesData.map((currency) => ({
    value: currency.cc,
    label: `${currency.cc} - ${currency.name} (${currency.symbol})`,
  }));
  const countryOptions = mapToOptions(dropDown?.locations?.countries || []) as Array<{ value: number; label: string }>;
  const allStateOptions = mapToOptions(dropDown?.locations?.states || []) as Array<{ value: number; label: string }>;
  const stateOptions = mapToOptions(
    dropDown?.locations?.states?.filter(
      (state) => state.country_id === watchedCountryId
    ) || []
  ) as Array<{ value: number; label: string }>;
  const cityOptions = mapToOptions(
    dropDown?.locations?.cities?.filter(
      (city) => city.state_id === watchedStateId
    ) || []
  ) as Array<{ value: number; label: string }>;
  const locationOptions = mapToOptions(
    dropDown?.locations?.locations?.filter(
      (loc) => loc.city_id === watchedCityId
    ) || []
  ) as Array<{ value: number; label: string }>;

  const accountingOptions = [
    { value: "tally", label: "Tally" },
    { value: "quickbooks", label: "QuickBooks" },
    { value: "sap", label: "SAP" },
    { value: "oracle", label: "Oracle" },
    { value: "other", label: "Other" },
  ];

  // Functions for GSTIN management
  const addGSTINEntry = () => {
    const newIndex = gstinEntries.length;
    const newEntry: GSTINEntry = {
      id: `temp_${Date.now()}_${newIndex}`,
      gstin: "",
      address: "",
      pin_code: "",
      pms_state_id: "",
    };

    const newEntries = [...gstinEntries, newEntry];
    setGstinEntries(newEntries);

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

      setTimeout(() => {
        filteredEntries.forEach((entry, index) => {
          setValue(`company_gstin_details_attributes.${index}.gstin`, entry.gstin);
          setValue(`company_gstin_details_attributes.${index}.address`, entry.address);
          setValue(`company_gstin_details_attributes.${index}.pin_code`, entry.pin_code);
          setValue(`company_gstin_details_attributes.${index}.pms_state_id`, entry.pms_state_id ? parseInt(entry.pms_state_id) : 0);
        });

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

  // Form submission handler
  const onSubmit = async (data: Company) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const validGstinEntries = gstinEntries.filter(
        (entry) =>
          entry.gstin.trim() !== "" ||
          entry.address.trim() !== "" ||
          entry.pin_code.trim() !== "" ||
          entry.pms_state_id !== ""
      );

      const gstinAttributes =
        validGstinEntries.length > 0
          ? validGstinEntries.map((entry) => ({
              id: entry.id && entry.id.startsWith("temp_") ? undefined : entry.id,
              gstin: entry.gstin,
              address: entry.address,
              pin_code: entry.pin_code,
              pms_state_id: entry.pms_state_id ? parseInt(entry.pms_state_id) : undefined,
              _destroy: false,
            }))
          : [];

      const completeFormData = {
        ...data,
        ...(gstinAttributes.length > 0 && {
          company_gstin_details_attributes: gstinAttributes,
        }),
      };

      await Promise.resolve(onSave?.(completeFormData as Record<string, unknown>));

      if (mode === "create") {
        reset();
        setGstinEntries([]);
        localStorage.removeItem("companyFormData");
      }
    } catch (error: unknown) {
      console.error("Error saving company data:", error);

      const errorResponse = error as {
        response?: { data?: Record<string, string[]> };
        data?: Record<string, string[]>;
      };
      const errorData = errorResponse?.response?.data || errorResponse?.data;

      if (errorData && typeof errorData === "object") {
        setSubmitError(errorData);
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Company Information */}
        <CompanyBasicInfo
          register={register}
          control={control}
          errors={errors}
          isReadOnly={isReadOnly}
          orgOptions={orgOptions}
          currencyOptions={currencyOptions}
          accountingOptions={accountingOptions}
        />

        {/* Office Address */}
        <CompanyOfficeAddress
          register={register}
          control={control}
          errors={errors}
          isReadOnly={isReadOnly}
          countryOptions={countryOptions}
          stateOptions={stateOptions}
          cityOptions={cityOptions}
          locationOptions={locationOptions}
          watchedCountryId={watchedCountryId}
          watchedStateId={watchedStateId}
          watchedCityId={watchedCityId}
        />

        {/* Billing Address */}
        <CompanyBillingAddress
          register={register}
          control={control}
          errors={errors}
          isReadOnly={isReadOnly}
          countryOptions={countryOptions}
          stateOptions={stateOptions}
          cityOptions={cityOptions}
          locationOptions={locationOptions}
          watchedSameAsOfficeAddress={watchedSameAsOfficeAddress}
        />

        {/* Payroll Information */}
        <CompanyPayrollInfo
          register={register}
          errors={errors}
          isReadOnly={isReadOnly}
        />

        {/* Configurations */}
        <CompanyConfigurations
          register={register}
          isReadOnly={isReadOnly}
        />

        {/* GSTIN */}
        <CompanyGSTIN
          control={control}
          setValue={setValue}
          isReadOnly={isReadOnly}
          gstinEntries={gstinEntries}
          setGstinEntries={setGstinEntries}
          allStateOptions={allStateOptions}
          addGSTINEntry={addGSTINEntry}
          removeGSTINEntry={removeGSTINEntry}
        />

        {/* Form Actions */}
        <CompanyFormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
        />

        {/* Error Display */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(submitError).map(([field, messages]) => (
                      <li key={field}>
                        <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyForm;
