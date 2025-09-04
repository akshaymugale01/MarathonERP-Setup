import React, { useState, useEffect, useCallback, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import SelectBox from "../../../components/forms/SelectBox";
import { fetchServiceBoq } from "../../../services/Home/Engineering/serviceIndentService";

interface Option {
  value: string;
  label: string;
}

interface WorkCategory {
  id?: number;
  value?: number;
  name: string;
}

interface WorkSubCategory {
  id?: number;
  value?: number;
  name: string;
  work_sub_categories?: WorkSubCategory[];
}

interface BOQService {
  id: number;
  boq_activity_id: number;
  name: string;
  uom_id: number;
  uom_name: string;
  quantity: number;
  wastage: number;
  total_qty: number;
  created_at?: string;
  updated_at?: string;
  wastage_percentage?: number | null;
  boq_activity_services_by_floors?: {
    id: number;
    boq_activity_service_id: number;
    quantity: number;
    floor_id: number;
    wastage: number;
    created_at: string;
    updated_at: string;
    floor_name: string;
  }[];
}

interface BOQActivityFromAPI {
  id: number;
  service_boq_id: number;
  labour_activity_id: number;
  description_id: number;
  labour_activity_name: string;
  description: string;
  boq_activity_services: BOQService[];
}

interface ServiceBOQItem {
  id: number;
  project_id: number;
  subproject_id: number;
  wing_id: string;
  level_one_id: number;
  level_two_id: number;
  level_three_id?: number;
  level_four_id?: number;
  level_five_id?: number;
  project_name: string;
  subproject_name: string;
  wing_name: string;
  level_one: {
    id: number;
    name: string;
    active: boolean;
  };
  level_two: {
    id: number;
    name: string;
    benchmark_lead_time?: number;
  };
  level_three?: {
    id: number;
    name: string;
  };
  level_four?: {
    id: number;
    name: string;
  };
  level_five?: {
    id: number;
    name: string;
  };
  boq_activities: BOQActivityFromAPI[];
}

interface ServiceBOQResponse {
  service_boqs: ServiceBOQItem[];
  total_pages: number;
  current_page: number;
  total_count: number;
}

interface BOQActivity {
  id: number;
  service_boq_id: number; // Add service BOQ ID from API
  name: string;
  work_category: WorkCategory;
  work_sub_category: WorkSubCategory;
  level_three?: WorkSubCategory;
  level_four?: WorkSubCategory;
  level_five?: WorkSubCategory;
  level: number;
  path: string;
  isExpanded?: boolean;
  hasChildren?: boolean;
  parentPath?: string;
  boq_activity_services: BOQService[];
}

interface SelectedBOQData {
  id?: number; // Optional - only for existing si_boq_activity records
  boq_activity_id: number;
  boq_activity_name: string;
  services: {
    id?: number; // Optional - only for existing si_boq_activity_service records
    boq_activity_service_id: number;
    service_name: string;
    required_qty: string;
    executed_qty: string;
    wo_cumulative_qty: string;
    abstract_cumulative_qty: string;
  }[];
}

interface WorkCategoryData {
  level_one_id: number;
  level_two_id: number;
  level_three_id?: number;
  level_four_id?: number;
  level_five_id?: number;
}

interface BOQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SelectedBOQData[]) => void;
  workCategoryData: WorkCategoryData | null;
  existingBOQData?: SelectedBOQData[]; // Add existing BOQ data prop
}

interface FilterForm {
  selectedWorkCategory: string;
  selectedSubCategory: string;
  selectedBOQLocation: string;
}

export default function BOQModal({
  isOpen,
  onClose,
  onSubmit,
  workCategoryData,
  existingBOQData = [], // Default to empty array
}: BOQModalProps) {
  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);
  const [workSubCategories, setWorkSubCategories] = useState<WorkSubCategory[]>(
    []
  );
  const [boqActivities, setBOQActivities] = useState<BOQActivity[]>([]);
  const [allBOQActivities, setAllBOQActivities] = useState<BOQActivity[]>([]); // Store all loaded BOQ data
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedActivities, setSelectedActivities] = useState<Set<number>>(
    new Set()
  );
  const [selectedServices, setSelectedServices] = useState<
    Map<number, Set<number>>
  >(new Map());
  const [serviceQuantities, setServiceQuantities] = useState<
    Map<number, string>
  >(new Map());
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { control, watch } = useForm<FilterForm>({
    defaultValues: {
      selectedWorkCategory: "",
      selectedSubCategory: "",
      selectedBOQLocation: "",
    },
  });

  const selectedWorkCategory = watch("selectedWorkCategory");
  const selectedSubCategory = watch("selectedSubCategory");
  const selectedBOQLocation = watch("selectedBOQLocation");

  // Clear selections when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedActivities(new Set());
      setSelectedServices(new Map());
      setServiceQuantities(new Map());
      setExpandedItems(new Set());
      // Reset filter options when modal closes
      setWorkCategories([]);
      setWorkSubCategories([]);
    }
  }, [isOpen]);

  // Preselect existing BOQ data when modal opens or when BOQ activities are loaded
  useEffect(() => {
    if (isOpen && existingBOQData.length > 0 && boqActivities.length > 0) {
      console.log("=== PRESELECTING EXISTING BOQ DATA ===");
      console.log("Existing BOQ data:", existingBOQData);
      console.log("Available BOQ activities:", boqActivities);

      const newSelectedActivities = new Set<number>();
      const newSelectedServices = new Map<number, Set<number>>();
      const newServiceQuantities = new Map<number, string>();
      const newExpandedItems = new Set<string>();

      existingBOQData.forEach((existingBOQ) => {
        console.log(
          `Processing existing BOQ activity: ${existingBOQ.boq_activity_name} (ID: ${existingBOQ.boq_activity_id})`
        );

        // Find matching activity in the current BOQ activities
        const matchingActivity = boqActivities.find(
          (activity) => activity.id === existingBOQ.boq_activity_id
        );

        if (matchingActivity) {
          console.log(`Found matching activity: ${matchingActivity.name}`);

          // Select the activity
          newSelectedActivities.add(existingBOQ.boq_activity_id);

          // Expand the activity to show services
          newExpandedItems.add(matchingActivity.path);

          // Process services
          const activityServices = new Set<number>();

          existingBOQ.services.forEach((existingService) => {
            console.log(
              `Processing existing service: ${existingService.service_name} (ID: ${existingService.boq_activity_service_id})`
            );

            // Find matching service in the activity
            const matchingService = matchingActivity.boq_activity_services.find(
              (service) =>
                service.id === existingService.boq_activity_service_id
            );

            if (matchingService) {
              console.log(
                `Found matching service: ${matchingService.name}, required_qty: ${existingService.required_qty}`
              );

              // Select the service
              activityServices.add(existingService.boq_activity_service_id);

              // Set the quantity from existing data
              newServiceQuantities.set(
                existingService.boq_activity_service_id,
                existingService.required_qty
              );
            } else {
              console.warn(
                `Service not found in current BOQ: ${existingService.service_name} (ID: ${existingService.boq_activity_service_id})`
              );
            }
          });

          if (activityServices.size > 0) {
            newSelectedServices.set(
              existingBOQ.boq_activity_id,
              activityServices
            );
          }
        } else {
          console.warn(
            `Activity not found in current BOQ: ${existingBOQ.boq_activity_name} (ID: ${existingBOQ.boq_activity_id})`
          );
        }
      });

      console.log("Preselected activities:", newSelectedActivities);
      console.log("Preselected services:", newSelectedServices);
      console.log("Preselected quantities:", newServiceQuantities);
      console.log("Expanded items:", newExpandedItems);

      setSelectedActivities(newSelectedActivities);
      setSelectedServices(newSelectedServices);
      setServiceQuantities(newServiceQuantities);
      setExpandedItems(newExpandedItems);

      console.log("=== END PRESELECTING EXISTING BOQ DATA ===");
    }
  }, [isOpen, existingBOQData, boqActivities]);

  // Handle expand/collapse for hierarchy
  const handleToggleExpand = (path: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Get visible BOQ activities based on expanded state
  const getVisibleBOQActivities = useCallback(() => {
    if (!boqActivities.length) return [];

    // For now, show all activities since we have a simpler structure
    return boqActivities;
  }, [boqActivities]);

  // Fetch all BOQ data when modal opens
  const fetchAllBOQData = useCallback(
    async (page: number = 1) => {
      if (!workCategoryData) {
        setBOQActivities([]);
        setAllBOQActivities([]);
        return;
      }

      setLoading(true);
      try {
        console.log(
          "Fetching BOQ data for work category:",
          workCategoryData,
          "Page:",
          page
        );

        // Call service BOQ API with work category level IDs and page (no filters to API)
        const params = {
          level_one_id: workCategoryData.level_one_id,
          level_two_id: workCategoryData.level_two_id,
          ...(workCategoryData.level_three_id && {
            level_three_id: workCategoryData.level_three_id,
          }),
          ...(workCategoryData.level_four_id && {
            level_four_id: workCategoryData.level_four_id,
          }),
          ...(workCategoryData.level_five_id && {
            level_five_id: workCategoryData.level_five_id,
          }),
          page: page,
        };

        console.log("API params:", params);
        const response = await fetchServiceBoq(params);
        console.log("BOQ API response:", response);

        // Type the response data
        const data = response as ServiceBOQResponse;

        // Update pagination state from response
        if (data.current_page) setCurrentPage(data.current_page);
        if (data.total_pages) setTotalPages(data.total_pages);
        if (data.total_count) setTotalCount(data.total_count);

        // Transform the response data into BOQActivity format
        const activities: BOQActivity[] = [];
        const categoryNames = new Set<string>();
        const subCategoryNames = new Set<string>();

        if (data.service_boqs && Array.isArray(data.service_boqs)) {
          data.service_boqs.forEach((boqItem: ServiceBOQItem) => {
            if (
              boqItem.boq_activities &&
              Array.isArray(boqItem.boq_activities)
            ) {
              // Create hierarchical structure based on BOQ activities and services
              boqItem.boq_activities.forEach(
                (boqActivity: BOQActivityFromAPI) => {
                  if (
                    boqActivity.boq_activity_services &&
                    Array.isArray(boqActivity.boq_activity_services)
                  ) {
                    console.log(
                      "Processing BOQ Activity:",
                      boqActivity.labour_activity_name ||
                        boqActivity.description
                    );
                    console.log(
                      "BOQ Activity Services:",
                      boqActivity.boq_activity_services
                    );

                    const categoryName =
                      boqItem.level_one?.name || "Unknown Category";
                    const subCategoryName =
                      boqItem.level_two?.name || "Unknown Sub Category";
                    const activityName =
                      boqActivity.labour_activity_name ||
                      boqActivity.description ||
                      "Unknown Activity";

                    categoryNames.add(categoryName);
                    subCategoryNames.add(subCategoryName);

                    // Create the main activity (this represents groups like "Block Work")
                    const activityPath = `${categoryName}/${subCategoryName}/${activityName}`;

                    const activity: BOQActivity = {
                      id: boqActivity.id,
                      service_boq_id: boqActivity.service_boq_id, // Add service BOQ ID from API
                      name: activityName,
                      work_category: {
                        id: boqItem.level_one?.id || 0,
                        name: categoryName,
                      },
                      work_sub_category: {
                        id: boqItem.level_two?.id || 0,
                        name: subCategoryName,
                      },
                      level: 1, // Main activity level
                      path: activityPath,
                      isExpanded: false,
                      hasChildren: boqActivity.boq_activity_services.length > 0,
                      boq_activity_services: boqActivity.boq_activity_services,
                    };

                    activities.push(activity);
                  }
                }
              );
            }
          });
        }

        console.log("Transformed activities:", activities);
        console.log("Pagination info:", {
          currentPage: data.current_page,
          totalPages: data.total_pages,
          totalCount: data.total_count,
        });

        // Update work categories and sub categories for filtering from the actual data
        // Accumulate options across all pages loaded so far
        const categoryOptions: WorkCategory[] = Array.from(categoryNames).map(
          (name) => ({
            id: activities.find((a) => a.work_category.name === name)
              ?.work_category.id,
            name: name,
          })
        );

        const subCategoryOptions: WorkSubCategory[] = Array.from(
          subCategoryNames
        ).map((name) => ({
          id: activities.find((a) => a.work_sub_category.name === name)
            ?.work_sub_category.id,
          name: name,
        }));

        // Merge with existing options to accumulate across pages
        setWorkCategories((prevCategories) => {
          const existingNames = new Set(prevCategories.map((cat) => cat.name));
          const newCategories = categoryOptions.filter(
            (cat) => !existingNames.has(cat.name)
          );
          return [...prevCategories, ...newCategories];
        });

        setWorkSubCategories((prevSubCategories) => {
          const existingNames = new Set(
            prevSubCategories.map((subCat) => subCat.name)
          );
          const newSubCategories = subCategoryOptions.filter(
            (subCat) => !existingNames.has(subCat.name)
          );
          return [...prevSubCategories, ...newSubCategories];
        });

        // Store current page data
        setAllBOQActivities(activities);
        setBOQActivities(activities); // Show current page activities
      } catch (error) {
        console.error("Error fetching BOQ data:", error);
        setBOQActivities([]);
        setAllBOQActivities([]);
      } finally {
        setLoading(false);
      }
    },
    [workCategoryData]
  );

  // Filter BOQ activities based on selected filters
  const applyFilters = useCallback(() => {
    console.log("=== APPLYING FILTERS ===");
    console.log("Filter values:", {
      selectedWorkCategory,
      selectedSubCategory,
      selectedBOQLocation,
    });
    console.log("Available work categories:", workCategories);
    console.log("Available sub categories:", workSubCategories);
    console.log("All BOQ activities count:", allBOQActivities.length);

    if (!allBOQActivities.length) {
      console.log("No BOQ activities to filter");
      setBOQActivities([]);
      return;
    }

    let filteredActivities = [...allBOQActivities];

    // Filter by work category
    if (selectedWorkCategory) {
      console.log("Filtering by work category ID:", selectedWorkCategory);
      const selectedCategoryObj = workCategories.find(
        (cat) => cat.id?.toString() === selectedWorkCategory
      );
      console.log("Selected category object:", selectedCategoryObj);

      const beforeCount = filteredActivities.length;
      filteredActivities = filteredActivities.filter((activity) => {
        const matches =
          activity.work_category.id?.toString() === selectedWorkCategory ||
          activity.work_category.name === selectedCategoryObj?.name;
        console.log(
          `Activity "${activity.name}" - Category: ${activity.work_category.name} (ID: ${activity.work_category.id}) - Matches: ${matches}`
        );
        return matches;
      });
      console.log(
        `Filtered by work category: ${beforeCount} → ${filteredActivities.length} activities`
      );
    }

    // Filter by sub work category
    if (selectedSubCategory) {
      console.log("Filtering by sub category ID:", selectedSubCategory);
      const selectedSubCategoryObj = workSubCategories.find(
        (subCat) => subCat.id?.toString() === selectedSubCategory
      );
      console.log("Selected sub category object:", selectedSubCategoryObj);

      const beforeCount = filteredActivities.length;
      filteredActivities = filteredActivities.filter((activity) => {
        const matches =
          activity.work_sub_category.id?.toString() === selectedSubCategory ||
          activity.work_sub_category.name === selectedSubCategoryObj?.name;
        console.log(
          `Activity "${activity.name}" - Sub Category: ${activity.work_sub_category.name} (ID: ${activity.work_sub_category.id}) - Matches: ${matches}`
        );
        return matches;
      });
      console.log(
        `Filtered by sub category: ${beforeCount} → ${filteredActivities.length} activities`
      );
    }

    // BOQ Location filter would need to be implemented based on API structure
    // For now, we'll skip it since it's not clear how location relates to BOQ activities
    if (selectedBOQLocation) {
      console.log(
        "BOQ Location filter selected but not implemented yet:",
        selectedBOQLocation
      );
    }

    console.log("=== FILTER RESULT ===");
    console.log(`Final filtered activities: ${filteredActivities.length}`);
    console.log(
      "Filtered activities:",
      filteredActivities.map((a) => ({
        name: a.name,
        category: a.work_category.name,
        subCategory: a.work_sub_category.name,
      }))
    );
    setBOQActivities(filteredActivities);
  }, [
    allBOQActivities,
    selectedWorkCategory,
    selectedSubCategory,
    selectedBOQLocation,
    workCategories,
    workSubCategories,
  ]);

  // Create a stable function for pagination navigation
  const navigateToPage = useCallback(
    (page: number) => {
      console.log("Navigating to page:", page);
      setCurrentPage(page);
      fetchAllBOQData(page);
    },
    [fetchAllBOQData]
  );

  // Load BOQ data when modal opens
  useEffect(() => {
    if (isOpen && workCategoryData) {
      console.log("Modal opened, loading first page");
      navigateToPage(1);
    }
  }, [isOpen, workCategoryData, navigateToPage]);

  // Apply filters whenever allBOQActivities or filter values change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Reset to page 1 when filters change (but avoid infinite loop)
  const prevFiltersRef = useRef({
    selectedWorkCategory,
    selectedSubCategory,
    selectedBOQLocation,
  });
  useEffect(() => {
    const currentFilters = {
      selectedWorkCategory,
      selectedSubCategory,
      selectedBOQLocation,
    };
    const prevFilters = prevFiltersRef.current;

    // Check if any filter actually changed
    const filtersChanged =
      currentFilters.selectedWorkCategory !==
        prevFilters.selectedWorkCategory ||
      currentFilters.selectedSubCategory !== prevFilters.selectedSubCategory ||
      currentFilters.selectedBOQLocation !== prevFilters.selectedBOQLocation;

    if (filtersChanged && isOpen && workCategoryData) {
      console.log(
        "Filters changed, but not resetting page since we're using client-side filtering",
        { prevFilters, currentFilters }
      );
      // Don't reset to page 1 for client-side filtering, just apply filters
    }

    prevFiltersRef.current = currentFilters;
  }, [
    selectedWorkCategory,
    selectedSubCategory,
    selectedBOQLocation,
    isOpen,
    workCategoryData,
  ]);

  const handleActivityToggle = (activityId: number, checked: boolean) => {
    console.log("=== DEBUG: handleActivityToggle called ===", {
      activityId,
      checked,
    });
    setSelectedActivities((prev) => {
      console.log("Previous selectedActivities:", prev);
      const newSelected = new Set(prev);
      if (checked) {
        newSelected.add(activityId);
        // Auto-expand the activity when selected to show services
        const activity = boqActivities.find((a) => a.id === activityId);
        if (activity && activity.hasChildren) {
          setExpandedItems((prevExpanded) => {
            const newExpanded = new Set(prevExpanded);
            newExpanded.add(activity.path);
            return newExpanded;
          });
        }
      } else {
        newSelected.delete(activityId);
        // Also remove all services for this activity
        setSelectedServices((prevServices) => {
          const newServices = new Map(prevServices);
          newServices.delete(activityId);
          return newServices;
        });
        // Clear quantities for services of this activity
        const activity = boqActivities.find((a) => a.id === activityId);
        if (activity) {
          setServiceQuantities((prevQty) => {
            const newQty = new Map(prevQty);
            activity.boq_activity_services.forEach((service) => {
              newQty.delete(service.id);
            });
            return newQty;
          });
        }
      }
      console.log("New selectedActivities:", newSelected);
      return newSelected;
    });
  };

  const handleServiceToggle = (
    activityId: number,
    serviceId: number,
    checked: boolean
  ) => {
    console.log("=== DEBUG: handleServiceToggle called ===", {
      activityId,
      serviceId,
      checked,
    });
    setSelectedServices((prev) => {
      console.log("Previous selectedServices:", prev);
      const newServices = new Map(prev);
      const activityServices = newServices.get(activityId) || new Set();

      if (checked) {
        activityServices.add(serviceId);
        // Auto-select the parent activity when any service is selected
        setSelectedActivities((prevActivities) => {
          const newActivities = new Set(prevActivities);
          newActivities.add(activityId);
          return newActivities;
        });
      } else {
        activityServices.delete(serviceId);
        // Remove quantity if unchecked
        setServiceQuantities((prevQty) => {
          const newQty = new Map(prevQty);
          newQty.delete(serviceId);
          return newQty;
        });

        // If no services are selected for this activity, unselect the activity
        if (activityServices.size === 0) {
          setSelectedActivities((prevActivities) => {
            const newActivities = new Set(prevActivities);
            newActivities.delete(activityId);
            return newActivities;
          });
        }
      }

      newServices.set(activityId, activityServices);
      console.log("New selectedServices:", newServices);
      return newServices;
    });
  };

  const isServiceSelected = (activityId: number, serviceId: number) => {
    const activityServices = selectedServices.get(activityId);
    return activityServices?.has(serviceId) || false;
  };

  const handleQuantityChange = (serviceId: number, value: string) => {
    setServiceQuantities((prev) => {
      const newQty = new Map(prev);
      if (value.trim() === "") {
        newQty.delete(serviceId);
      } else {
        newQty.set(serviceId, value);
      }
      return newQty;
    });
  };

  const handleAccept = () => {
    console.log("=== DEBUG: handleAccept called ===");
    console.log("selectedActivities:", selectedActivities);
    console.log("selectedServices:", selectedServices);
    console.log("serviceQuantities:", serviceQuantities);
    console.log("boqActivities length:", boqActivities.length);

    const result: SelectedBOQData[] = [];

    // Process all activities that have selected services
    boqActivities.forEach((activity) => {
      // Check if this activity has any selected services
      const activityServices = selectedServices.get(activity.id);
      if (activityServices && activityServices.size > 0) {
        const selectedActivityServices = activity.boq_activity_services.filter(
          (service) => activityServices.has(service.id)
        );

        if (selectedActivityServices.length > 0) {
          console.log(`Including activity: ${activity.name} (ID: ${activity.id}, BOQ ID: ${activity.service_boq_id}) with ${selectedActivityServices.length} services`);
          result.push({
            id: activity.service_boq_id, // Include BOQ ID (service_boq_id from API)
            boq_activity_id: activity.id,
            boq_activity_name: activity.name,
            services: selectedActivityServices.map((service) => ({
              boq_activity_service_id: service.id,
              service_name: service.name,
              required_qty: serviceQuantities.get(service.id) || "0",
              executed_qty: "0",
              wo_cumulative_qty: "0",
              abstract_cumulative_qty: "0",
            })),
          });
        }
      }
    });

    console.log("Selected BOQ Activities with BOQ IDs:", result);
    onSubmit(result);
    onClose();
  };

  if (!isOpen) return null;

  // Transform work categories for select options
  const workCategoryOptions: Option[] = workCategories.map((category) => ({
    value: category.id?.toString() || "",
    label: category.name,
  }));

  // Transform work sub categories for select options
  const subCategoryOptions: Option[] = workSubCategories.map((subCategory) => ({
    value: subCategory.id?.toString() || "",
    label: subCategory.name,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            Select BOQ Activities & Services
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          {/* Show summary of existing selections */}
          {existingBOQData.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm text-blue-800">
                <span className="font-medium">Existing BOQ Data:</span>{" "}
                {existingBOQData.length} activities with{" "}
                {existingBOQData.reduce(
                  (total, boq) => total + boq.services.length,
                  0
                )}{" "}
                services are preselected from previous data.
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Work Category <span className="text-red-600">*</span>
              </label>
              <SelectBox
                name="selectedWorkCategory"
                control={control}
                options={workCategoryOptions}
                placeholder="Select Category"
                required={false}
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Sub Work Category <span className="text-red-600">*</span>
              </label>
              <SelectBox
                name="selectedSubCategory"
                control={control}
                options={subCategoryOptions}
                placeholder="Select Category"
                required={false}
                isClearable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                BOQ Location <span className="text-red-600">*</span>
              </label>
              <SelectBox
                name="selectedBOQLocation"
                control={control}
                options={[
                  { value: "basement", label: "Basement" },
                  { value: "ground_floor", label: "Ground Floor" },
                  { value: "first_floor", label: "First Floor" },
                  { value: "second_floor", label: "Second Floor" },
                ]}
                placeholder="Select location"
                required={false}
                isClearable={true}
              />
            </div>
          </div>

          {/* Results Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">
                Loading BOQ activities...
              </div>
            </div>
          ) : boqActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-600">
                {allBOQActivities.length === 0
                  ? "No BOQ activities found for the selected work category"
                  : "No BOQ activities found for selected filter"}
              </div>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-red-800 text-white">
                <div className="grid grid-cols-8 gap-2 p-3">
                  <div className="text-sm font-medium text-center">Sr.No</div>
                  <div className="text-sm font-medium text-center">☐</div>
                  <div className="text-sm font-medium">Name</div>
                  <div className="text-sm font-medium text-center">Unit</div>
                  <div className="text-sm font-medium text-center">
                    Estimated Qty
                  </div>
                  <div className="text-sm font-medium text-center">
                    Required Qty
                  </div>
                  <div className="text-sm font-medium text-center">
                    Balanced Qty
                  </div>
                  <div className="text-sm font-medium text-center">
                    Executed SI Qty
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="max-h-96 overflow-y-auto">
                {getVisibleBOQActivities().map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    {/* Main Activity Row */}
                    <div
                      className={`grid grid-cols-8 gap-2 p-3 border-b hover:bg-gray-50 ${
                        selectedActivities.has(activity.id)
                          ? "bg-blue-50 border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="text-sm text-center">{index + 1}</div>
                      <div className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedActivities.has(activity.id)}
                          onChange={(e) =>
                            handleActivityToggle(activity.id, e.target.checked)
                          }
                          className="text-red-600 focus:ring-red-500"
                        />
                        {selectedActivities.has(activity.id) && (
                          <span className="ml-1 text-xs text-blue-600 font-medium">
                            ✓
                          </span>
                        )}
                      </div>

                      {/* Name Column with Hierarchy */}
                      <div
                        className="text-sm"
                        style={{
                          paddingLeft: `${(activity.level - 1) * 20}px`,
                        }}
                      >
                        <div className="flex items-center">
                          {activity.hasChildren ? (
                            <button
                              onClick={() => handleToggleExpand(activity.path)}
                              className="text-gray-600 mr-2 hover:text-gray-800 flex-shrink-0 text-lg font-bold"
                            >
                              {expandedItems.has(activity.path) ? "▼" : "▶"}
                            </button>
                          ) : (
                            <span className="mr-2 flex-shrink-0 w-5"></span>
                          )}
                          <span className="font-medium text-gray-900">
                            {activity.name}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-center text-gray-600">-</div>
                      <div className="text-sm text-center text-gray-600">-</div>
                      <div className="text-sm text-center text-gray-600">-</div>
                      <div className="text-sm text-center text-gray-600">-</div>
                      <div className="text-sm text-center text-gray-600">
                        0.00
                      </div>
                    </div>

                    {/* Services Rows (shown when activity is expanded, regardless of selection) */}
                    {expandedItems.has(activity.path) &&
                      activity.boq_activity_services.map(
                        (service, serviceIndex) => (
                          <div
                            key={service.id}
                            className={`grid grid-cols-8 gap-2 p-3 border-b bg-gray-50 hover:bg-gray-100 ${
                              isServiceSelected(activity.id, service.id)
                                ? "bg-green-50 border-green-200"
                                : ""
                            }`}
                          >
                            <div className="text-sm text-center text-gray-500">
                              {index + 1}.{serviceIndex + 1}
                            </div>
                            <div className="text-center">
                              <input
                                type="checkbox"
                                checked={isServiceSelected(
                                  activity.id,
                                  service.id
                                )}
                                onChange={(e) =>
                                  handleServiceToggle(
                                    activity.id,
                                    service.id,
                                    e.target.checked
                                  )
                                }
                                className="text-red-600 focus:ring-red-500"
                              />
                              {isServiceSelected(activity.id, service.id) && (
                                <span className="ml-1 text-xs text-green-600 font-medium">
                                  ✓
                                </span>
                              )}
                            </div>

                            {/* Service Name with deeper indentation */}
                            <div
                              className="text-sm"
                              style={{
                                paddingLeft: `${activity.level * 20 + 20}px`,
                              }}
                            >
                              <span className="text-gray-700">
                                {service.name}
                              </span>
                              {isServiceSelected(activity.id, service.id) &&
                                serviceQuantities.get(service.id) && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Qty: {serviceQuantities.get(service.id)}
                                  </span>
                                )}
                            </div>

                            {/* Unit from API */}
                            <div className="text-sm text-center text-gray-600">
                              {service.uom_name || "Unit"}
                            </div>

                            {/* Estimated Qty - using total_qty from API */}
                            <div className="text-sm text-center text-gray-600">
                              {service.total_qty
                                ? service.total_qty.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : "0.00"}
                            </div>

                            {/* Required Qty Input */}
                            <div className="text-center">
                              {isServiceSelected(activity.id, service.id) ? (
                                <input
                                  type="number"
                                  value={
                                    serviceQuantities.get(service.id) || ""
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      service.id,
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                  placeholder="0.00"
                                  min="0"
                                  step="0.01"
                                />
                              ) : (
                                <span className="text-sm text-gray-500">-</span>
                              )}
                            </div>

                            {/* Balanced Qty - Always show estimated qty, minus required if selected */}
                            <div className="text-sm text-center text-gray-600">
                              {isServiceSelected(activity.id, service.id) &&
                              serviceQuantities.get(service.id)
                                ? Math.max(
                                    0,
                                    (service.total_qty || 0) -
                                      parseFloat(
                                        serviceQuantities.get(service.id) || "0"
                                      )
                                  ).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : service.total_qty
                                ? service.total_qty.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                : "0.00"}
                            </div>

                            {/* Executed SI Qty - always 0.00 for now */}
                            <div className="text-sm text-center text-gray-600">
                              0.00
                            </div>
                          </div>
                        )
                      )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination - Only show when no filters are applied */}
        {totalPages > 1 &&
          !selectedWorkCategory &&
          !selectedSubCategory &&
          !selectedBOQLocation && (
            <div className="border-t px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({totalCount} total
                items)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    console.log(
                      "Previous button clicked, current page:",
                      currentPage,
                      "going to:",
                      currentPage - 1
                    );
                    navigateToPage(currentPage - 1);
                  }}
                  disabled={currentPage <= 1 || loading}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNumber > totalPages) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => {
                        console.log(
                          "Page button clicked:",
                          pageNumber,
                          "current page:",
                          currentPage
                        );
                        navigateToPage(pageNumber);
                      }}
                      disabled={loading}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === pageNumber
                          ? "bg-red-800 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => {
                    console.log(
                      "Next button clicked, current page:",
                      currentPage,
                      "going to:",
                      currentPage + 1
                    );
                    navigateToPage(currentPage + 1);
                  }}
                  disabled={currentPage >= totalPages || loading}
                  className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        {/* {/* Show filter info when filters are applied  */}
        {/* {(selectedWorkCategory || selectedSubCategory || selectedBOQLocation) && (
          <div className="border-t px-6 py-4 bg-yellow-50">
            <div className="text-sm text-yellow-800">
              <span className="font-medium">Filters Applied:</span> Showing {boqActivities.length} filtered results from all pages.  
              <button
                onClick={() => {
                  // Clear all filters
                  console.log("Clearing all filters");
                  setValue("selectedWorkCategory", "");
                  setValue("selectedSubCategory", "");
                  setValue("selectedBOQLocation", "");
                }}
                className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
              >
                Clear filters to enable pagination
              </button>
            </div>
          </div>
        )} */}

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={handleAccept}
            className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
