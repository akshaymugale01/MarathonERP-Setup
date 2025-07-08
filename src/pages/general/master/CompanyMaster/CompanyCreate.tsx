import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import CompanyForm from "./CompanyForm";
import type { Company } from "../../../../types/General/companies";
import {
  createCompany,
  updateCompany,
  getCompanyById,
} from "../../../../services/General/companyServices";

interface CompanyCreateProps {
  mode: "create" | "edit" | "view";
}

const CompanyCreate: React.FC<CompanyCreateProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Company | null>(null);

  console.log("CompanyCreate - mode:", mode, "id:", id, "id type:", typeof id);

  // Load company data for edit/view mode
  useEffect(() => {
    if (mode !== "create" && id) {
      setLoading(true);
      console.log("Fetching company with ID:", id);
      getCompanyById(Number(id))
        .then((company) => {
          console.log("Raw API response for getCompanyById:", company);
          setInitialData(company);
        })
        .catch((error) => {
          console.error("Error loading company:", error);
          console.error("Error response:", error.response?.data);
          toast.error("Failed to load company data");
          // navigate("/setup/general/companies");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [mode, id]);

  // Handle save operation
  const handleSave = async (data: Record<string, unknown>) => {
    try {
      setLoading(true);

      console.log("Data received in handleSave:", data);

      // Use the data directly since form fields are already properly named
      const companyData = {
        ...data,
        // Ensure active is set to true for new companies
      };

      console.log("Final company data to be sent to API:", companyData);

      if (mode === "edit" && id) {
        await updateCompany(Number(id), companyData as Company);
        toast.success("Company updated successfully");
        navigate("/setup/general/companies");
      } else {
        await createCompany(companyData as Company);
        toast.success("Company created successfully");
        navigate("/setup/general/companies");
      }
    } catch (error: unknown) {
      console.error("Error saving company:", error);
      let errorMessage = `Failed to ${
        mode === "edit" ? "update" : "create"
      } company`;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        errorMessage = response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel operation
  const handleCancel = () => {
    navigate("/setup/general/companies");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <CompanyForm
      mode={mode}
      companyId={id ? Number(id) : undefined}
      initialData={initialData || undefined}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

export default CompanyCreate;
