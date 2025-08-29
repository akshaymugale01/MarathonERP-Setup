import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdDelete, MdClose } from "react-icons/md";
import SelectBox, { Option } from "../../../components/forms/SelectBox";
import WorkCategoryModal from "./WorkCategoryModal";
import BOQModal from "./BOQModal";
import {
  createServiceIndent,
  updateServiceIndent,
  getServiceIndentById,
  fetchProjects,
  CreateServiceIndentPayload,
  UpdateServiceIndentPayload,
  fetchFloors,
  fetchDepartments,
} from "../../../services/Home/Engineering/serviceIndentService";
import {
  ServiceIndentFormData,
  WorkCategory,
  SelectedCategory,
  SelectedBOQData,
  AttachmentItem,
  SiWorkCategory,
} from "../../../types/Home/engineering/serviceIndent";

type FormMode = "create" | "edit" | "view";

export default function ServiceIndentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode: FormMode = id
    ? searchParams.get("mode") === "view"
      ? "view"
      : "edit"
    : "create";

  // Form state
  const { control, handleSubmit, watch, setValue } =
    useForm<ServiceIndentFormData>({
      defaultValues: {
        type_of_work_order: "",
        project: "",
        sub_project: "",
        wing: "",
        wbs: true,
        type_of_contract: "",
        work_urgency: "",
        status: "",
        si_date: new Date().toISOString().split("T")[0],
        created_on: new Date().toISOString().split("T")[0],
      },
    });

  // State for modals and data
  const [showWorkCategoryModal, setShowWorkCategoryModal] = useState(false);
  const [showBOQModal, setShowBOQModal] = useState(false);
  const [currentWorkCategoryIndex, setCurrentWorkCategoryIndex] =
    useState<number>(-1);
  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);
  const [selectedBOQData, setSelectedBOQData] = useState<SelectedBOQData[]>([]);

  // API data state
  const [projectsData, setProjectsData] = useState<{
    projects: unknown[];
  } | null>(null);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWing, setSelectedWing] = useState("");
  const [floors, setFloors] = useState<any>(null);
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const DEPARTMENT = localStorage.getItem("department");
  const RequistionerName = localStorage.getItem("UserName")
  const RequistId = localStorage.getItem("user_id")

  useEffect(() => {
    fetchFloors().then(setFloors);
    fetchDepartments().then(setDepartment);
  }, []);

  //   console.log("department", department);

  const departmentOptions =
    department?.map((dept: { name: string; id: number }) => ({
      label: dept.name,
      value: dept.id,
    })) || [];
  //   console.log("Department Values", departmentOptions);

  const floorOptions =
    floors?.pms_wings?.map((wing: { name: string; value: number }) => ({
      label: wing.name,
      value: wing.value,
    })) || [];

  //   console.log("Options Wing", floorOptions);

  //   console.log("flooroptions", floorOptions);

  // Attachment states
  const [vendorAttachments, setVendorAttachments] = useState<AttachmentItem[]>(
    []
  );

  const [internalAttachments, setInternalAttachments] = useState<
    AttachmentItem[]
  >([]);

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:type;base64, prefix to get just the base64 content
        const base64Content = result.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Dropdown options
  const typeOfWorkOrderOptions: Option[] = [
    { value: "new_si", label: "New" },
    { value: "variation", label: "Variation" },
    { value: "amendment", label: "Amendment" },
    { value: "variation_and_amendment", label: "Variation and Amendment" },
  ];

  const typeOfContractOptions: Option[] = [
    { value: "labour", label: "Labour" },
    { value: "composite", label: "Composite" },
  ];

  const workUrgencyOptions: Option[] = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const statusOptions: Option[] = [
    { value: "Not Yet Started", label: "Not Yet Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" },
  ];

  //   const departmentOptions: Option[] = [{ value: "IT", label: "IT" }];

  // Dynamic options based on API data
  const projectOptions: Option[] = useMemo(() => {
    const options = (projectsData?.projects || []).map((p: unknown) => ({
      value: (p as { id: number }).id.toString(),
      label: (p as { formatted_name: string }).formatted_name,
    }));
    return options;
  }, [projectsData]);

  const siteOptions: Option[] = useMemo(() => {
    if (!selectedProject) return [];
    const project = (projectsData?.projects || []).find(
      (p: unknown) => (p as { id: number }).id === parseInt(selectedProject)
    );
    const options = (
      (project as { pms_sites?: unknown[] })?.pms_sites || []
    ).map((s: unknown) => ({
      value: (s as { id: number }).id.toString(),
      label: (s as { name: string }).name,
    }));
    return options;
  }, [projectsData, selectedProject]);

  const wingOptions: Option[] = useMemo(() => {
    if (!selectedProject || !selectedSite) return [];
    const project = (projectsData?.projects || []).find(
      (p: unknown) => (p as { id: number }).id === parseInt(selectedProject)
    );
    const site = ((project as { pms_sites?: unknown[] })?.pms_sites || []).find(
      (s: unknown) => (s as { id: number }).id === parseInt(selectedSite)
    );
    const options = ((site as { pms_wings?: unknown[] })?.pms_wings || []).map(
      (w: unknown) => ({
        value: (w as { id: number }).id.toString(),
        label: (w as { name: string }).name,
      })
    );
    return options;
  }, [projectsData, selectedProject, selectedSite]);

  const isReadOnly = mode === "view";

  // Watch form values for dependent dropdowns
  const watchedProject = watch("project");
  const watchedSubProject = watch("sub_project");
  const watchedWing = watch("wing");

  // Sync form values with state variables
  useEffect(() => {
    if (watchedProject !== selectedProject) {
      setSelectedProject(watchedProject || "");
      // Reset dependent fields when project changes
      if (watchedProject !== selectedProject) {
        setSelectedSite("");
        setSelectedWing("");
        setValue("sub_project", "");
        setValue("wing", "");
      }
    }
  }, [watchedProject, selectedProject, setValue]);

  useEffect(() => {
    if (watchedSubProject !== selectedSite) {
      setSelectedSite(watchedSubProject || "");
      // Reset dependent fields when site changes
      if (watchedSubProject !== selectedSite) {
        setSelectedWing("");
        setValue("wing", "");
      }
    }
  }, [watchedSubProject, selectedSite, setValue]);

  useEffect(() => {
    if (watchedWing !== selectedWing) {
      setSelectedWing(watchedWing || "");
    }
  }, [watchedWing, selectedWing]);

  // URL pre-selection logic
  useEffect(() => {
    const projectIdFromURL = searchParams.get("projectId");
    const siteIdFromURL = searchParams.get("siteId");
    const wingIdFromURL = searchParams.get("wingId");

    if (projectIdFromURL && projectsData?.projects?.length > 0) {
      const projectId = parseInt(projectIdFromURL);
      const siteId = siteIdFromURL ? parseInt(siteIdFromURL) : undefined;
      const wingId = wingIdFromURL ? parseInt(wingIdFromURL) : undefined;

      const project = projectsData.projects.find(
        (p: unknown) => (p as { id: number }).id === projectId
      );
      if (project) {
        setSelectedProject(projectId.toString());
        setValue("project", projectId.toString());

        if (siteId) {
          const site = (
            (project as { pms_sites?: unknown[] })?.pms_sites || []
          ).find((s: unknown) => (s as { id: number }).id === siteId);
          if (site) {
            setSelectedSite(siteId.toString());
            setValue("sub_project", siteId.toString());

            if (wingId) {
              const wing = (
                (site as { pms_wings?: unknown[] })?.pms_wings || []
              ).find((w: unknown) => (w as { id: number }).id === wingId);
              if (wing) {
                setSelectedWing(wingId.toString());
                setValue("wing", wingId.toString());
              }
            }
          }
        }
      }
    }
  }, [projectsData, searchParams, setValue]);

  useEffect(() => {
    // Load dropdown data
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      const projectsData = await fetchProjects();
      //   console.log("Projects API response:", projectsData);
      setProjectsData(projectsData);
    } catch (error: unknown) {
      console.error("Error fetching project data:", error);
      toast.error("Failed to fetch project data");
    }
  };

  const fetchServiceIndentData = useCallback(
    async (serviceIndentId: string) => {
      try {
        setLoading(true);
        const serviceIndentData = await getServiceIndentById(serviceIndentId);
        console.log("Service Indent data:", serviceIndentData);

        // Populate form fields
        setValue(
          "type_of_work_order",
          serviceIndentData.type_of_work_order || ""
        );
        setValue("type_of_contract", serviceIndentData.type_of_contract || "");
        setValue("project", serviceIndentData.pms_project_id?.toString() || "");
        setValue(
          "sub_project",
          serviceIndentData.pms_site_id?.toString() || ""
        );
        setValue("wing", serviceIndentData.pms_wing_id?.toString() || "");
        setValue("wbs", serviceIndentData.wbs ?? true);
        setValue("status", serviceIndentData.status || "");
        setValue("reason_for_variation", serviceIndentData.reason || "");
        setValue("work_urgency", serviceIndentData.work_urgency ? "Yes" : "No");
        setValue(
          "reason_for_urgency",
          serviceIndentData.reason_for_urgency || ""
        );
        setValue("remark", serviceIndentData.remark || "");
        setValue(
          "si_date",
          serviceIndentData.si_date || new Date().toISOString().split("T")[0]
        );
        setValue("work_description", serviceIndentData.work_description || "");
        setValue("requisitioner_name", serviceIndentData.requistioner_name || "");
        setValue("department_name", serviceIndentData.department_name || "");
        setValue("requested_to_department", serviceIndentData.requested_to_department_id?.toString() || "");

        // Set selected values for dependent dropdowns
        if (serviceIndentData.pms_project_id) {
          setSelectedProject(serviceIndentData.pms_project_id.toString());
        }
        if (serviceIndentData.pms_site_id) {
          setSelectedSite(serviceIndentData.pms_site_id.toString());
        }
        if (serviceIndentData.pms_wing_id) {
          setSelectedWing(serviceIndentData.pms_wing_id.toString());
        }

        // Populate work categories if available
        if (
          serviceIndentData.si_work_categories &&
          serviceIndentData.si_work_categories.length > 0
        ) {
          const workCategoriesData: WorkCategory[] =
            serviceIndentData.si_work_categories.map((cat: SiWorkCategory) => ({
              id: cat.id?.toString() || crypto.randomUUID(), // Keep the actual DB ID as string
              level_one_id: cat.level_one_id || 0,
              level_one_name: cat.level_one_name || "",
              level_two_id: cat.level_two_id || 0,
              level_two_name: cat.level_two_name || "",
              level_three_id: cat.level_three_id,
              level_three_name: cat.level_three_name,
              level_four_id: cat.level_four_id,
              level_four_name: cat.level_four_name,
              level_five_id: cat.level_five_id,
              level_five_name: cat.level_five_name,
              planned_date_start_work: cat.planned_date_start_work || "",
              planned_finish_date: cat.planned_finish_date || "",
              boq:
                cat.si_boq_activities && cat.si_boq_activities.length > 0
                  ? "Selected BOQ"
                  : "Not Selected",
            }));
          console.log(
            "Loaded work categories with IDs:",
            workCategoriesData.map((c) => ({
              id: c.id,
              dbId: serviceIndentData.si_work_categories?.find(
                (sc: SiWorkCategory) => sc.id?.toString() === c.id
              )?.id,
            }))
          );
          setWorkCategories(workCategoriesData);
        }

        // Handle attachments if they exist in the response
        const responseData = serviceIndentData as any;
        if (
          responseData.vendor_attachments &&
          Array.isArray(responseData.vendor_attachments)
        ) {
          const vendorAttachmentsData: AttachmentItem[] =
            responseData.vendor_attachments.map((att: any) => ({
              id: att.id?.toString() || crypto.randomUUID(),
              document_name: att.document_name || "",
              file_name: att.filename || "",
              upload_at: att.created_at
                ? new Date(att.created_at).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              upload_file: null,
              action: "Choose file",
              url: att.url || att.doc_path || "",
              content_type: att.content_type || "",
            }));
          setVendorAttachments(vendorAttachmentsData);
        }

        if (
          responseData.internal_attachments &&
          Array.isArray(responseData.internal_attachments)
        ) {
          const internalAttachmentsData: AttachmentItem[] =
            responseData.internal_attachments.map((att: any) => ({
              id: att.id?.toString() || crypto.randomUUID(),
              document_name: att.document_name || "",
              file_name: att.filename || "",
              upload_at: att.created_at
                ? new Date(att.created_at).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
              upload_file: null,
              action: "Choose file",
              url: att.url || att.doc_path || "",
              content_type: att.content_type || "",
            }));
          setInternalAttachments(internalAttachmentsData);
        }
      } catch (error: unknown) {
        console.error("Error fetching service indent data:", error);
        toast.error("Failed to fetch service indent data");
      } finally {
        setLoading(false);
      }
    },
    [setValue]
  );

  // Fetch existing data for edit/view modes
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && id && projectsData) {
      fetchServiceIndentData(id);
    }
  }, [mode, id, projectsData, fetchServiceIndentData]);

  const handleAddWorkCategory = () => {
    setCurrentWorkCategoryIndex(-1);
    setShowWorkCategoryModal(true);
  };

  const handleDeleteWorkCategory = async (index: number) => {
    // if (
    //   !window.confirm("Are you sure you want to delete this work category?")
    // ) {
    //   return;
    // }

    const categoryToDelete = workCategories[index];

    // If it's an existing record (has numeric ID), mark for destruction
    if (
      categoryToDelete.id &&
      !isNaN(Number(categoryToDelete.id)) &&
      mode === "edit"
    ) {
      // Mark the category for destruction but keep it in the array
      setWorkCategories((prev) =>
        prev.map((cat, i) =>
          i === index ? { ...cat, _destroy: true } : cat
        )
      );
    //toast.success("Work category marked for deletion");
    } else {
      // For new records (UUID or create mode), just remove from local state
      setWorkCategories((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleWorkCategorySubmit = (categoryData: SelectedCategory[]) => {
    // Convert SelectedCategory[] to WorkCategory[]
    const workCategoriesWithBoq: WorkCategory[] = categoryData.map((cat) => ({
      id: cat.id,
      level_one_id: cat.level_one_id,
      level_one_name: cat.level_one_name,
      level_two_id: cat.level_two_id,
      level_two_name: cat.level_two_name,
      level_three_id: cat.level_three_id,
      level_four_id: cat.level_four_id,
      level_five_id: cat.level_five_id,
      planned_date_start_work: cat.planned_date_start_work,
      planned_finish_date: cat.planned_finish_date,
      boq: "Not Selected", // Default BOQ status
    }));
    setWorkCategories(workCategoriesWithBoq);
    setShowWorkCategoryModal(false);
  };

  const handleBOQSelect = (index: number) => {
    const category = workCategories[index];
    if (category) {
      setCurrentWorkCategoryIndex(index);
      setShowBOQModal(true);
    }
  };

  const handleBOQSubmit = (boqData: SelectedBOQData[]) => {
    setSelectedBOQData(boqData);
    setShowBOQModal(false);

    // Update the work category with selected BOQ
    if (currentWorkCategoryIndex !== -1) {
      setWorkCategories((prev) =>
        prev.map((cat, i) =>
          i === currentWorkCategoryIndex ? { ...cat, boq: "Selected BOQ" } : cat
        )
      );
    }
  };

  const handleAddAttachment = (type: "vendor" | "internal") => {
    const newAttachment: AttachmentItem = {
      id: crypto.randomUUID(),
      document_name: "",
      file_name: "",
      upload_at: new Date().toISOString().split("T")[0],
      upload_file: null,
      action: "Choose file",
    };

    if (type === "vendor") {
      setVendorAttachments((prev) => [...prev, newAttachment]);
    } else {
      setInternalAttachments((prev) => [...prev, newAttachment]);
    }
  };

  const handleDeleteAttachment = (id: string, type: "vendor" | "internal") => {
    if (type === "vendor") {
      setVendorAttachments((prev) => prev.filter((item) => item.id !== id));
    } else {
      setInternalAttachments((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFileChange = async (
    file: File | null,
    attachmentId: string,
    type: "vendor" | "internal"
  ) => {
    if (type === "vendor") {
      setVendorAttachments((prev) =>
        prev.map((item) =>
          item.id === attachmentId
            ? {
                ...item,
                upload_file: file,
                file_name: file?.name || item.file_name,
                content_type: file?.type || item.content_type,
              }
            : item
        )
      );
    } else {
      setInternalAttachments((prev) =>
        prev.map((item) =>
          item.id === attachmentId
            ? {
                ...item,
                upload_file: file,
                file_name: file?.name || item.file_name,
                content_type: file?.type || item.content_type,
              }
            : item
        )
      );
    }
  };

  const prepareAttachmentsForSubmit = async (attachments: AttachmentItem[]) => {
    const preparedAttachments: Array<{
      id?: number;
      document_file_name: string;
      filename: string;
      content?: string;
      content_type?: string;
    }> = [];

    for (const attachment of attachments) {
      if (attachment.document_name && attachment.file_name) {
        const attachmentData: {
          id?: number;
          document_file_name: string;
          filename: string;
          content?: string;
          content_type?: string;
        } = {
          document_file_name: attachment.document_name,
          filename: attachment.file_name,
        };

        // If it's an existing attachment (has numeric ID), always include the ID
        if (attachment.id && !isNaN(Number(attachment.id))) {
          attachmentData.id = Number(attachment.id);
          console.log(
            `Processing existing attachment with ID: ${attachment.id}`
          );

          // If there's a new file uploaded, include the content
          if (attachment.upload_file) {
            try {
              const base64Content = await convertToBase64(
                attachment.upload_file
              );
              attachmentData.content = base64Content;
              attachmentData.content_type = attachment.upload_file.type;
              console.log(
                `Updating existing attachment ${attachment.id} with new file`
              );
            } catch (error) {
              console.error("Error converting file to base64:", error);
            }
          } else {
            console.log(
              `Keeping existing attachment ${attachment.id} unchanged`
            );
          }
        } else if (attachment.upload_file) {
          // New attachment with file
          try {
            const base64Content = await convertToBase64(attachment.upload_file);
            attachmentData.content = base64Content;
            attachmentData.content_type = attachment.upload_file.type;
            console.log(`Creating new attachment: ${attachment.file_name}`);
          } catch (error) {
            console.error("Error converting file to base64:", error);
            continue; // Skip this attachment if file conversion fails
          }
        } else {
          // New attachment without file - skip it
          console.log(
            `Skipping new attachment without file: ${attachment.file_name}`
          );
          continue;
        }

        preparedAttachments.push(attachmentData);
      }
    }

    console.log(
      `Prepared ${preparedAttachments.length} attachments for submission`
    );
    return preparedAttachments;
  };

  const onSubmit = async (data: ServiceIndentFormData) => {
    try {
      // Prepare attachments data
      const preparedVendorAttachments = await prepareAttachmentsForSubmit(
        vendorAttachments
      );
      const preparedInternalAttachments = await prepareAttachmentsForSubmit(
        internalAttachments
      );

      console.log("Prepared vendor attachments:", preparedVendorAttachments);
      console.log(
        "Prepared internal attachments:",
        preparedInternalAttachments
      );

      console.log("Work categories before submit:", workCategories);
      console.log("Selected BOQ data:", selectedBOQData);
      console.log("Mode:", mode);
      console.log("Vendor attachments before submit:", vendorAttachments);
      console.log("Internal attachments before submit:", internalAttachments);

    const payload: CreateServiceIndentPayload = {
      service_indent: {
        type_of_work_order: data.type_of_work_order,
        type_of_contract: data.type_of_contract,
        pms_project_id: parseInt(data.project),
        pms_site_id: parseInt(data.sub_project),
        pms_wing_id: parseInt(data.wing),
        wbs: data.wbs,
        status: data.status,
        reason: data.reason_for_variation,
        work_urgency: data.work_urgency === "Yes",
        reason_for_urgency: data.reason_for_urgency,
        remark: data.remark,
        si_date: data.si_date,
        requistioner_id: RequistId || "2", 
        pms_department_id: 31, 
        requested_to_department_id: data.requested_to_department ? parseInt(data.requested_to_department) : 31, 
        work_description: data.work_description,
        ...(preparedVendorAttachments.length > 0 && {
        vendor_attachments: preparedVendorAttachments,
        }),
        ...(preparedInternalAttachments.length > 0 && {
        internal_attachments: preparedInternalAttachments,
        }),
        si_work_categories_attributes: workCategories.map((cat) => {
        const categoryData: {
          id?: number;
          level_one_id: number;
          level_two_id: number;
          level_three_id?: number;
          level_four_id?: number;
          level_five_id?: number;
          planned_date_start_work?: string;
          planned_finish_date?: string;
          _destroy?: boolean;
          si_boq_activities_attributes: unknown[];
        } = {
          level_one_id: cat.level_one_id,
          level_two_id: cat.level_two_id,
          level_three_id: cat.level_three_id,
          level_four_id: cat.level_four_id,
          level_five_id: cat.level_five_id,
          planned_date_start_work: cat.planned_date_start_work,
          planned_finish_date: cat.planned_finish_date,
          si_boq_activities_attributes: selectedBOQData.map((boq) => ({
            boq_activity_id: boq.boq_activity_id,
            si_boq_activity_services_attributes: boq.services.map(
            (service) => ({
              boq_activity_service_id: service.boq_activity_service_id,
              required_qty: service.required_qty,
              executed_qty: service.executed_qty,
              wo_cumulative_qty: service.wo_cumulative_qty,
              abstract_cumulative_qty: service.abstract_cumulative_qty,
            })
            ),
          })),
        };

        // If it's an existing record (has numeric ID) and we're in edit mode, include the ID
        if (mode === "edit" && cat.id && !isNaN(Number(cat.id))) {
          categoryData.id = Number(cat.id);
          console.log(`Including ID ${cat.id} for existing category`);
        } else {
          console.log(`No ID for category with UUID: ${cat.id}`);
        }

        // Include _destroy flag if it exists
        if (cat._destroy) {
          categoryData._destroy = true;
          console.log(`Marking category ${cat.id} for destruction`);
        }

        return categoryData;
        }),
      },
    };

      console.log("Final payload:", JSON.stringify(payload, null, 2));

      if (mode === "edit" && id) {
        await updateServiceIndent(id, payload);
        toast.success("Service Indent updated successfully");
      } else {
        await createServiceIndent(payload);
        toast.success("Service Indent created successfully");
      }

      navigate("/home/engineering/service-indent");
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      toast.error(
        `Failed to ${mode === "edit" ? "update" : "create"} Service Indent`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-800"></div>
              <span className="text-gray-700">
                Loading service indent data...
              </span>
            </div>
          </div>
        </div>
      )}
      <main className="container max-w-7xl mx-auto py-8 px-4 space-y-6">
        {/* Main Form Card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex">
              <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl">
                <h1 className="text-lg font-medium">
                  {mode === "create"
                    ? "Create Service Indent"
                    : mode === "edit"
                    ? "Edit Service Indent"
                    : "View Service Indent"}
                </h1>
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="p-6">
              {/* First Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Type of Work Order */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type Of Work Order <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="type_of_work_order"
                    control={control}
                    options={typeOfWorkOrderOptions}
                    placeholder="Select Type of Work Order"
                    isDisabled={isReadOnly}
                  />
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="project"
                    control={control}
                    options={projectOptions}
                    placeholder="Select Project"
                    isDisabled={isReadOnly}
                  />
                </div>

                {/* Sub-Project */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Sub-Project <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="sub_project"
                    control={control}
                    options={siteOptions}
                    placeholder="Select Sub-Project"
                    isDisabled={isReadOnly}
                  />
                </div>

                {/* Wing */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Wing <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="wing"
                    control={control}
                    options={wingOptions}
                    placeholder="Select Wing"
                    isDisabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* WBS Toggle */}
                <div className="flex items-center space-x-4">
                  <Controller
                    name="wbs"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={field.value}
                          onChange={() => field.onChange(true)}
                          disabled={isReadOnly}
                          className="text-red-600"
                        />
                        <span>WBS</span>
                      </label>
                    )}
                  />
                  <Controller
                    name="wbs"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          checked={!field.value}
                          onChange={() => field.onChange(false)}
                          disabled={isReadOnly}
                          className="text-red-600"
                        />
                        <span>Non-WBS</span>
                      </label>
                    )}
                  />
                </div>

                {/* Type of Contract */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Type of Contract <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="type_of_contract"
                    control={control}
                    options={typeOfContractOptions}
                    placeholder="Select Type of Contract"
                    isDisabled={isReadOnly}
                  />
                </div>

                {/* Range Of Floors */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Range Of Floors (Floor/Level){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <SelectBox
                      name="from_location"
                      control={control}
                      options={floorOptions}
                      placeholder="From"
                      isDisabled={isReadOnly}
                      required={false}
                    />
                    <span className="text-gray-500">to</span>
                    <SelectBox
                      name="to_location"
                      control={control}
                      options={floorOptions}
                      placeholder="To"
                      isDisabled={isReadOnly}
                      required={false}
                    />
                  </div>
                </div>

                {/* From Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    From Location (Floor/Level){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="from_location"
                    control={control}
                    options={floorOptions}
                    placeholder="Select Location"
                    isDisabled={isReadOnly}
                    required={false}
                  />
                </div>

                {/* To Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    To Location (Floor/Level){" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="to_location"
                    control={control}
                    options={floorOptions}
                    placeholder="Select Location"
                    isDisabled={isReadOnly}
                    required={false}
                  />
                </div>
              </div>

              {/* Third Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Select Work Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Work Category <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddWorkCategory}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Add work category
                  </button>
                </div>

                {/* Work Urgency */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Urgency <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="work_urgency"
                    control={control}
                    options={workUrgencyOptions}
                    placeholder="Select Work Urgency"
                    isDisabled={isReadOnly}
                  />
                </div>

                {/* Reason for Urgency */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason for Urgency <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="reason_for_urgency"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isReadOnly}
                        placeholder="Need to complete ASAP"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status of Work <span className="text-red-600">*</span>
                  </label>
                  <SelectBox
                    name="status"
                    control={control}
                    options={statusOptions}
                    placeholder="Select Status"
                    isDisabled={isReadOnly}
                  />
                </div>
              </div>

              {/* Fourth Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Reason For Variation */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason For Variation <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="reason_for_variation"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                {/* Reason For Amendment */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reason For Amendment <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="reason_for_amendment"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                {/* Remark */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Remark
                  </label>
                  <Controller
                    name="remark"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled={isReadOnly}
                        placeholder="Available"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Requested to Department
                  </label>
                  <SelectBox
                    name="requested_to_department"
                    control={control}
                    options={departmentOptions}
                    placeholder="Select Department"
                    isDisabled={isReadOnly}
                    required={false}
                  />
                </div>
              </div>

              {/* Fifth Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    SI Date <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="si_date"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Created On <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="created_on"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        readOnly
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Requisitioner Name <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="requisitioner_name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        readOnly
                        value={mode === "create" ? RequistionerName || "" : field.value || ""}
                        disabled={isReadOnly}
                        placeholder="Sadanand Gupta"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    )}
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Department Name
                    </label>
                    <Controller
                        name="department_name"
                        control={control}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                readOnly
                                value={mode === "create" ? DEPARTMENT || "" : field.value || ""}
                                disabled={isReadOnly}
                                placeholder="IT"
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        )}
                    />
                </div>
              </div>

              {/* Work Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                  Work Description
                </label>
                <Controller
                  name="work_description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      disabled={isReadOnly}
                      placeholder="Description"
                      rows={3}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Work Category Section */}
          <div className="bg-white rounded-lg shadow-lg mt-4">
            <div className="flex">
              <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl">
                {/* <div className="bg-white px-4 py-3 rounded-t-lg border-b"> */}
                <h2 className="text-lg font-medium text-white">
                  Work Category
                </h2>
              </div>
            </div>
            <div className="p-6">
              {workCategories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No work categories added yet.</p>
                  <button
                    type="button"
                    onClick={handleAddWorkCategory}
                    disabled={isReadOnly}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Add / Delete
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-red-800">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          Sr.No
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          Work Category/Sub Work Category/L3/L4/L5
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          Planned Date of Start Work
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          Planned Finished Date
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          BOQ
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {workCategories.filter(category => !category._destroy).map((category, index) => (
                        <tr key={category.id} className={`border-b ${category._destroy ? 'opacity-50 bg-red-50' : ''}`}>
                          <td className="border border-gray-300 px-3 py-2">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {category.level_one_name}
                            {category.level_two_name && ` → ${category.level_two_name}`}
                            {category.level_three_name && ` → ${category.level_three_name}`}
                            {category.level_four_name && ` → ${category.level_four_name}`}
                            {category.level_five_name && ` → ${category.level_five_name}`}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {category.planned_date_start_work}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {category.planned_finish_date}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <button
                              type="button"
                              onClick={() => handleBOQSelect(index)}
                              disabled={isReadOnly}
                              className="text-red-600 hover:text-red-800 underline"
                            >
                              {category.boq || "Edit/View BOQ"}
                            </button>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex gap-2">
                              {/* <button
                                type="button"
                                onClick={() => handleEditWorkCategory(index)}
                                disabled={isReadOnly}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <MdEdit size={16} />
                              </button> */}
                              <button
                                type="button"
                                onClick={() => handleDeleteWorkCategory(index)}
                                disabled={isReadOnly}
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
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddWorkCategory}
                      disabled={isReadOnly}
                      className="text-red-600 hover:text-red-800 underline"
                    >
                      Add / Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share with Vendor/Contractor Section */}
          <div className="bg-white rounded-lg shadow-lg mt-4">
            <div className="flex">
              <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl flex justify-between items-center w-full">
                <h2 className="text-lg font-medium text-white">
                  Share with Vendor/Contractor
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddAttachment("vendor")}
                  disabled={isReadOnly}
                  className="text-white hover:text-gray-200 underline text-sm font-medium"
                >
                  Add Attachment
                </button>
              </div>
            </div>
            <div className="p-6">
              {vendorAttachments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No vendor attachments added yet.</p>
                  <button
                    type="button"
                    onClick={() => handleAddAttachment("vendor")}
                    disabled={isReadOnly}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Add Attachment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 min-w-[1200px]">
                    <thead>
                      <tr className="bg-red-800">
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "140px" }}
                        >
                          Document Type
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "120px" }}
                        >
                          File Type
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "250px" }}
                        >
                          File Name
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "120px" }}
                        >
                          Upload At
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "300px" }}
                        >
                          Upload File
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "100px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorAttachments.map((attachment, index) => (
                        <tr key={attachment.id} className="border-b">
                          <td className="border border-gray-300 px-3 py-2">
                            <select
                              value={attachment.document_name}
                              onChange={(e) => {
                                const updated = [...vendorAttachments];
                                updated[index].document_name = e.target.value;
                                setVendorAttachments(updated);
                              }}
                              disabled={isReadOnly}
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="">Choose Type</option>
                              <option value="Drawing">Drawing</option>
                              <option value="Specification">
                                Specification
                              </option>
                              <option value="BOQ">BOQ</option>
                              <option value="Schedule">Schedule</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                            <div
                              className="text-gray-700 font-medium text-sm truncate"
                              title={attachment.content_type || "File Type"}
                            >
                              {attachment.content_type || "File Type"}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={attachment.file_name}
                              onChange={(e) => {
                                const updated = [...vendorAttachments];
                                updated[index].file_name = e.target.value;
                                setVendorAttachments(updated);
                              }}
                              disabled={isReadOnly}
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Enter file name..."
                              title={attachment.file_name}
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                            <div
                              className="text-gray-700 text-sm text-center"
                              title={attachment.upload_at}
                            >
                              {attachment.upload_at}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex items-center gap-2">
                              {attachment.url || attachment.upload_file ? (
                                <div className="flex items-center gap-2 w-full">
                                  {attachment.content_type?.startsWith(
                                    "image/"
                                  ) ? (
                                    <div className="flex items-center gap-2">
                                      <div className="group relative flex-shrink-0">
                                        <img
                                          src={attachment.url}
                                        //   alt={attachment.file_name}
                                          className="w-10 h-10 object-cover rounded border cursor-pointer hover:opacity-75"
                                          onClick={() =>
                                            window.open(
                                              attachment.url,
                                              "_blank"
                                            )
                                          }
                                          title="Click to view full image"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className="text-sm text-gray-700 truncate"
                                          title={
                                            attachment.upload_file?.name ||
                                            attachment.file_name
                                          }
                                        >
                                          {attachment.upload_file?.name ||
                                            attachment.file_name}
                                        </div>
                                        {attachment.upload_file && (
                                          <div className="text-xs text-green-600">
                                            Uploaded
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 w-full">
                                      <div className="group relative flex-shrink-0">
                                        <div
                                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 transition-colors text-xs whitespace-nowrap"
                                          onClick={() =>
                                            attachment.url &&
                                            window.open(
                                              attachment.url,
                                              "_blank"
                                            )
                                          }
                                          title="Click to view file"
                                        >
                                          📄 View File
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className="text-sm text-gray-700 truncate"
                                          title={
                                            attachment.upload_file?.name ||
                                            attachment.file_name
                                          }
                                        >
                                          {attachment.upload_file?.name ||
                                            attachment.file_name}
                                        </div>
                                        {attachment.upload_file && (
                                          <div className="text-xs text-green-600">
                                            New file uploaded
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 w-full">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input =
                                        document.createElement("input");
                                      input.type = "file";
                                      input.onchange = (e) => {
                                        const file =
                                          (e.target as HTMLInputElement)
                                            ?.files?.[0] || null;
                                        handleFileChange(
                                          file,
                                          attachment.id,
                                          "vendor"
                                        );
                                      };
                                      input.click();
                                    }}
                                    disabled={isReadOnly}
                                    className="px-3 py-1 bg-gray-300 text-black rounded border hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
                                  >
                                    Browse...
                                  </button>
                                  <span className="text-gray-500 text-sm flex-1">
                                    No file selected
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex gap-2 justify-center">
                              {attachment.url && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(attachment.url, "_blank")
                                  }
                                  className="p-1 text-red-800 hover:text-red-700 rounded-full hover:bg-blue-100"
                                  title="Download file"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                  </svg>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAttachment(
                                    attachment.id,
                                    "vendor"
                                  )
                                }
                                disabled={isReadOnly}
                                className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                                title="Remove attachment"
                              >
                                <MdClose size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Share with Internal Section */}
          <div className="bg-white rounded-lg shadow-lg mt-4">
            <div className="flex">
              <div className="bg-red-800 text-white px-4 py-2 rounded-tl-2xl flex justify-between items-center w-full">
                <h2 className="text-lg font-medium text-white">
                  Share with Internal
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddAttachment("internal")}
                  disabled={isReadOnly}
                  className="text-white hover:text-gray-200 underline text-sm font-medium"
                >
                  Add Attachment
                </button>
              </div>
            </div>
            <div className="p-6">
              {internalAttachments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No internal attachments added yet.</p>
                  <button
                    type="button"
                    onClick={() => handleAddAttachment("internal")}
                    disabled={isReadOnly}
                    className="mt-2 text-red-600 hover:text-red-800 underline"
                  >
                    Add Attachment
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 min-w-[1200px]">
                    <thead>
                      <tr className="bg-red-800">
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "140px" }}
                        >
                          Document Type
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "120px" }}
                        >
                          File Type
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "250px" }}
                        >
                          File Name
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "120px" }}
                        >
                          Upload At
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "300px" }}
                        >
                          Upload File
                        </th>
                        <th
                          className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold"
                          style={{ width: "100px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {internalAttachments.map((attachment, index) => (
                        <tr key={attachment.id} className="border-b">
                          <td className="border border-gray-300 px-3 py-2">
                            <select
                              value={attachment.document_name}
                              onChange={(e) => {
                                const updated = [...internalAttachments];
                                updated[index].document_name = e.target.value;
                                setInternalAttachments(updated);
                              }}
                              disabled={isReadOnly}
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                              <option value="">Choose Type</option>
                              <option value="Quotation">Quotation</option>
                              <option value="Approval">Approval</option>
                              <option value="Internal Note">
                                Internal Note
                              </option>
                              <option value="Report">Report</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                            <div
                              className="text-gray-700 font-medium text-sm truncate"
                              title={attachment.content_type || "File Type"}
                            >
                              {attachment.content_type || "File Type"}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <input
                              type="text"
                              value={attachment.file_name}
                              onChange={(e) => {
                                const updated = [...internalAttachments];
                                updated[index].file_name = e.target.value;
                                setInternalAttachments(updated);
                              }}
                              disabled={isReadOnly}
                              className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Enter file name..."
                              title={attachment.file_name}
                            />
                          </td>
                          <td className="border border-gray-300 px-3 py-2 bg-gray-100">
                            <div
                              className="text-gray-700 text-sm text-center"
                              title={attachment.upload_at}
                            >
                              {attachment.upload_at}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex items-center gap-2">
                              {attachment.url || attachment.upload_file ? (
                                <div className="flex items-center gap-2 w-full">
                                  {attachment.content_type?.startsWith(
                                    "image/"
                                  ) ? (
                                    <div className="flex items-center gap-2">
                                      <div className="group relative flex-shrink-0">
                                        <img
                                          src={attachment.url}
                                        //   alt={attachment.file_name}
                                          className="w-10 h-10 object-cover rounded border cursor-pointer hover:opacity-75"
                                          onClick={() =>
                                            window.open(
                                              attachment.url,
                                              "_blank"
                                            )
                                          }
                                          title="Click to view full image"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className="text-sm text-gray-700 truncate"
                                          title={
                                            attachment.upload_file?.name ||
                                            attachment.file_name
                                          }
                                        >
                                          {attachment.upload_file?.name ||
                                            attachment.file_name}
                                        </div>
                                        {attachment.upload_file && (
                                          <div className="text-xs text-green-600">
                                            Uploaded
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 w-full">
                                      <div className="group relative flex-shrink-0">
                                        <div
                                          className="px-2 py-1 bg-blue-100 text-red-800 rounded cursor-pointer hover:bg-blue-200 transition-colors text-xs whitespace-nowrap"
                                          onClick={() =>
                                            attachment.url &&
                                            window.open(
                                              attachment.url,
                                              "_blank"
                                            )
                                          }
                                          title="Click to view file"
                                        >
                                          📄 View File
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div
                                          className="text-sm text-gray-700 truncate"
                                          title={
                                            attachment.upload_file?.name ||
                                            attachment.file_name
                                          }
                                        >
                                          {attachment.upload_file?.name ||
                                            attachment.file_name}
                                        </div>
                                        {attachment.upload_file && (
                                          <div className="text-xs text-green-600">
                                            New file uploaded
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 w-full">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const input =
                                        document.createElement("input");
                                      input.type = "file";
                                      input.onchange = (e) => {
                                        const file =
                                          (e.target as HTMLInputElement)
                                            ?.files?.[0] || null;
                                        handleFileChange(
                                          file,
                                          attachment.id,
                                          "internal"
                                        );
                                      };
                                      input.click();
                                    }}
                                    disabled={isReadOnly}
                                    className="px-3 py-1 bg-gray-300 text-black rounded border hover:bg-gray-300 transition-colors text-sm whitespace-nowrap"
                                  >
                                    Browse...
                                  </button>
                                  <span className="text-gray-500 text-sm flex-1">
                                    No file selected
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            <div className="flex gap-2 justify-center">
                              {attachment.url && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(attachment.url, "_blank")
                                  }
                                  className="p-1 text-red-700 hover:text-red-700 rounded-full hover:bg-blue-100"
                                  title="Download file"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                  </svg>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteAttachment(
                                    attachment.id,
                                    "internal"
                                  )
                                }
                                disabled={isReadOnly}
                                className="p-1 text-red-600 hover:text-red-800 rounded-full hover:bg-red-100"
                                title="Remove attachment"
                              >
                                <MdClose size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders Section */}
          {/* <div className="bg-white rounded-lg shadow-lg mt-4">
            <div className="bg-white px-4 py-3 rounded-t-lg border-b">
              <h2 className="text-lg font-medium text-red-800">
                Recent orders
              </h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-red-800">
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                        SL NO.
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                        Created On
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                        Status
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                        Location
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm text-white font-semibold">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="border-b">
                        <td className="border border-gray-300 px-3 py-2">
                          {order.sl_no}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {order.created_on}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {order.status}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {order.location}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          {order.activity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div> */}

          {/* Form Actions - Single Set for Entire Form */}
          {/* <div className="bg-white rounded-lg shadow-lg">
            <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-lg">
              <button
                type="button"
                onClick={() => navigate("/home/engineering/service-indent")}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  className="px-6 py-2 bg-red-800 text-white rounded hover:bg-red-900"
                >
                  {mode === "edit" ? "Update" : "Create"}
                </button>
              )}
            </div>
          </div> */}

          {/* Form Actions */}
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg">
            <button
              type="button"
              onClick={() => navigate("/home/engineering/service-indent")}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                className="px-6 py-2 bg-red-800 text-white rounded hover:bg-red-900"
              >
                {mode === "edit" ? "Update" : "Create"}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Work Category Modal */}
      {showWorkCategoryModal && (
        <WorkCategoryModal
          isOpen={showWorkCategoryModal}
          onClose={() => setShowWorkCategoryModal(false)}
          onSubmit={handleWorkCategorySubmit}
          initialData={
            currentWorkCategoryIndex !== -1
              ? workCategories[currentWorkCategoryIndex]
              : null
          }
        />
      )}

      {/* BOQ Modal */}
      {showBOQModal && (
        <BOQModal
          isOpen={showBOQModal}
          onClose={() => setShowBOQModal(false)}
          onSubmit={handleBOQSubmit}
          workCategoryData={
            currentWorkCategoryIndex !== -1
              ? workCategories[currentWorkCategoryIndex]
              : null
          }
        />
      )}
    </div>
  );
}
