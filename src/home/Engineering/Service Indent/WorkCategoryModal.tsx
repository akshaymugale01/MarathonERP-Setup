import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import SelectBox, { Option } from "../../../components/forms/SelectBox";
import {
  fetchWorkCategories,
  fetchWorkSubCategories,
  fetchWorkCategoryMappings,
} from "../../../services/Home/Engineering/serviceIndentService";
import toast from "react-hot-toast";

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

interface WorkCategoryMapping {
  id: string;
  work_category: WorkCategory;
  work_sub_category: WorkSubCategory;
  level_three?: WorkSubCategory;
  level_four?: WorkSubCategory;
  level_five?: WorkSubCategory;
  level: number; // 1=category, 2=sub_category, 3=level_three, etc.
  path: string; // Complete path for selection tracking
  isExpanded?: boolean;
  hasChildren?: boolean;
  parentPath?: string;
}

interface SelectedCategory {
  id: string;
  level_one_id: number;
  level_one_name: string;
  level_two_id: number;
  level_two_name: string;
  level_three_id?: number;
  level_three_name?: string;
  level_four_id?: number;
  level_four_name?: string;
  level_five_id?: number;
  level_five_name?: string;
  planned_date_start_work: string;
  planned_finish_date: string;
}

interface WorkCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SelectedCategory[]) => void;
  initialData?: SelectedCategory | null;
}

interface FilterForm {
  selectedWorkCategory: string;
  selectedSubCategory: string;
}

export default function WorkCategoryModal({
  isOpen,
  onClose,
  onSubmit,
}: WorkCategoryModalProps) {
  const [workCategories, setWorkCategories] = useState<WorkCategory[]>([]);
  const [workSubCategories, setWorkSubCategories] = useState<WorkSubCategory[]>(
    []
  );
  const [workCategoryMappings, setWorkCategoryMappings] = useState<
    WorkCategoryMapping[]
  >([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Form control for filters
  const { control, watch, reset } = useForm<FilterForm>({
    defaultValues: {
      selectedWorkCategory: "",
      selectedSubCategory: "",
    },
  });

  const selectedWorkCategory = watch("selectedWorkCategory");
  const selectedSubCategory = watch("selectedSubCategory");

  // Create option arrays for SelectBox
  const workCategoryOptions: Option[] = workCategories
    .filter(category => category.value) // Filter for value property specifically
    .map((category) => ({
      value: category.value.toString(),
      label: category.name || "Unknown Category",
    }));

  const subCategoryOptions: Option[] = workSubCategories
    .filter(subCategory => subCategory.value) // Filter for value property specifically
    .map((subCategory) => ({
      value: subCategory.value.toString(), 
      label: subCategory.name || "Unknown Sub Category",
    }));

  // Debug logging
  console.log("Debug - Form values:", { selectedWorkCategory, selectedSubCategory });
  console.log("Debug - Work categories count:", workCategories.length);
  console.log("Debug - Sub categories count:", workSubCategories.length);
  console.log("Debug - Options:", { 
    workCategoryOptions: workCategoryOptions.length, 
    subCategoryOptions: subCategoryOptions.length 
  });

  useEffect(() => {
    if (isOpen) {
      fetchWorkCategoriesData();
      fetchWorkSubCategoriesData();
      // Reset form when modal opens
      reset({
        selectedWorkCategory: "",
        selectedSubCategory: "",
      });
      // Clear selected categories
      setSelectedCategories([]);
    }
  }, [isOpen, reset]);

  const fetchWorkCategoriesData = async () => {
    try {
      const data = await fetchWorkCategories();
      console.log("Work Categories API Response:", data);
      console.log("Response type:", typeof data);
      console.log("Response keys:", data ? Object.keys(data) : 'null');

      // Handle different possible response structures
      let categories = [];
      if (data.work_categories) {
        categories = data.work_categories;
      } else if (Array.isArray(data)) {
        categories = data;
      } else if (data.data) {
        categories = data.data;
      }

      console.log("Processed work categories:", categories);
      console.log("First category structure:", categories[0]);
      
      // Validate categories have required properties
      const validCategories = categories.filter(cat => cat && typeof cat === 'object' && cat.value && cat.name);
      console.log("Valid categories after filtering:", validCategories.length);
      
      setWorkCategories(validCategories || []);
    } catch (error) {
      console.error("Error fetching work categories:", error);
      setWorkCategories([]);
    }
  };

  const fetchWorkSubCategoriesData = async () => {
    try {
      const data = await fetchWorkSubCategories();
      console.log("Work Sub Categories API Response:", data);
      console.log("Response type:", typeof data);
      console.log("Response keys:", data ? Object.keys(data) : 'null');

      // Handle different possible response structures
      let subCategories = [];
      if (data.work_sub_categories) {
        subCategories = data.work_sub_categories;
      } else if (Array.isArray(data)) {
        subCategories = data;
      } else if (data.data) {
        subCategories = data.data;
      }

      console.log("Processed work sub categories:", subCategories);
      console.log("First sub category structure:", subCategories[0]);
      
      // Validate sub-categories have required properties
      const validSubCategories = subCategories.filter(cat => cat && typeof cat === 'object' && cat.value && cat.name);
      console.log("Valid sub categories after filtering:", validSubCategories.length);
      
      setWorkSubCategories(validSubCategories || []);
    } catch (error) {
      console.error("Error fetching work sub categories:", error);
      setWorkSubCategories([]);
    }
  };

  const fetchWorkCategoryMappingsData = useCallback(async (
    categoryId?: string,
    subCategoryId?: string
  ) => {
    try {
      setLoading(true);
      
      // Only fetch if at least one filter is selected
      if (!categoryId && !subCategoryId) {
        setWorkCategoryMappings([]);
        return;
      }
      
      // Call API with server-side filtering
      const data = await fetchWorkCategoryMappings({
        work_category_id: categoryId,
        work_sub_category_id: subCategoryId,
      });
      
      console.log("Mappings API Response:", data);
      
      // Handle the nested structure from your API
      const hierarchicalMappings: WorkCategoryMapping[] = [];
      let rawData = [];
      
      if (Array.isArray(data)) {
        rawData = data;
      } else if (data.mappings) {
        rawData = data.mappings;
      } else if (data.data) {
        rawData = data.data;
      }
      
      console.log("Raw mapping data:", rawData);
      
      // Create hierarchical structure
      rawData.forEach(category => {
        // Level 1: Work Category
        const categoryMapping: WorkCategoryMapping = {
          id: `cat-${category.id}`,
          work_category: {
            id: category.id,
            value: category.id,
            name: category.name
          },
          work_sub_category: { id: 0, value: 0, name: "" }, // Placeholder
          level: 1,
          path: `${category.id}`,
          hasChildren: category.work_sub_categories && category.work_sub_categories.length > 0,
          isExpanded: false
        };
        hierarchicalMappings.push(categoryMapping);

        if (category.work_sub_categories && Array.isArray(category.work_sub_categories)) {
          category.work_sub_categories.forEach(subCategory => {
            // Level 2: Sub Category
            const subCategoryMapping: WorkCategoryMapping = {
              id: `sub-${category.id}-${subCategory.id}`,
              work_category: {
                id: category.id,
                value: category.id,
                name: category.name
              },
              work_sub_category: {
                id: subCategory.id,
                value: subCategory.id,
                name: subCategory.name
              },
              level: 2,
              path: `${category.id}-${subCategory.id}`,
              parentPath: `${category.id}`,
              hasChildren: subCategory.sub_work_categories && subCategory.sub_work_categories.length > 0,
              isExpanded: false
            };
            hierarchicalMappings.push(subCategoryMapping);

            if (subCategory.sub_work_categories && Array.isArray(subCategory.sub_work_categories)) {
              subCategory.sub_work_categories.forEach(level3 => {
                // Level 3
                const level3Mapping: WorkCategoryMapping = {
                  id: `l3-${category.id}-${subCategory.id}-${level3.id}`,
                  work_category: {
                    id: category.id,
                    value: category.id,
                    name: category.name
                  },
                  work_sub_category: {
                    id: subCategory.id,
                    value: subCategory.id,
                    name: subCategory.name
                  },
                  level_three: {
                    id: level3.id,
                    value: level3.id,
                    name: level3.name
                  },
                  level: 3,
                  path: `${category.id}-${subCategory.id}-${level3.id}`,
                  parentPath: `${category.id}-${subCategory.id}`,
                  hasChildren: level3.sub_work_categories && level3.sub_work_categories.length > 0,
                  isExpanded: false
                };
                hierarchicalMappings.push(level3Mapping);

                if (level3.sub_work_categories && Array.isArray(level3.sub_work_categories)) {
                  level3.sub_work_categories.forEach(level4 => {
                    // Level 4
                    const level4Mapping: WorkCategoryMapping = {
                      id: `l4-${category.id}-${subCategory.id}-${level3.id}-${level4.id}`,
                      work_category: {
                        id: category.id,
                        value: category.id,
                        name: category.name
                      },
                      work_sub_category: {
                        id: subCategory.id,
                        value: subCategory.id,
                        name: subCategory.name
                      },
                      level_three: {
                        id: level3.id,
                        value: level3.id,
                        name: level3.name
                      },
                      level_four: {
                        id: level4.id,
                        value: level4.id,
                        name: level4.name
                      },
                      level: 4,
                      path: `${category.id}-${subCategory.id}-${level3.id}-${level4.id}`,
                      parentPath: `${category.id}-${subCategory.id}-${level3.id}`,
                      hasChildren: level4.sub_work_categories && level4.sub_work_categories.length > 0,
                      isExpanded: false
                    };
                    hierarchicalMappings.push(level4Mapping);

                    if (level4.sub_work_categories && Array.isArray(level4.sub_work_categories)) {
                      level4.sub_work_categories.forEach(level5 => {
                        // Level 5
                        const level5Mapping: WorkCategoryMapping = {
                          id: `l5-${category.id}-${subCategory.id}-${level3.id}-${level4.id}-${level5.id}`,
                          work_category: {
                            id: category.id,
                            value: category.id,
                            name: category.name
                          },
                          work_sub_category: {
                            id: subCategory.id,
                            value: subCategory.id,
                            name: subCategory.name
                          },
                          level_three: {
                            id: level3.id,
                            value: level3.id,
                            name: level3.name
                          },
                          level_four: {
                            id: level4.id,
                            value: level4.id,
                            name: level4.name
                          },
                          level_five: {
                            id: level5.id,
                            value: level5.id,
                            name: level5.name
                          },
                          level: 5,
                          path: `${category.id}-${subCategory.id}-${level3.id}-${level4.id}-${level5.id}`,
                          parentPath: `${category.id}-${subCategory.id}-${level3.id}-${level4.id}`,
                          hasChildren: false,
                          isExpanded: false
                        };
                        hierarchicalMappings.push(level5Mapping);
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
      
      console.log("Hierarchical mappings:", hierarchicalMappings);
      console.log("Total mappings created:", hierarchicalMappings.length);
      
      setWorkCategoryMappings(hierarchicalMappings || []);
    } catch (error) {
      console.error("Error fetching work category mappings:", error);
      setWorkCategoryMappings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load mappings when filters change
  useEffect(() => {
    if (isOpen && (selectedWorkCategory || selectedSubCategory)) {
      fetchWorkCategoryMappingsData(selectedWorkCategory, selectedSubCategory);
    } else if (isOpen) {
      // Clear mappings if no filters are selected
      setWorkCategoryMappings([]);
    }
  }, [selectedWorkCategory, selectedSubCategory, isOpen, fetchWorkCategoryMappingsData]);

  // No client-side filtering needed anymore since we're using server-side filtering
  const filteredMappings = workCategoryMappings;

  // Get visible mappings based on expanded state
  const getVisibleMappings = () => {
    const visibleMappings: WorkCategoryMapping[] = [];
    
    filteredMappings.forEach(mapping => {
      if (mapping.level === 1) {
        // Always show level 1 (work categories)
        visibleMappings.push(mapping);
      } else if (mapping.level === 2 && mapping.parentPath) {
        // Show level 2 if parent is expanded
        const parent = filteredMappings.find(m => m.path === mapping.parentPath);
        if (parent?.isExpanded) {
          visibleMappings.push(mapping);
        }
      } else if (mapping.level === 3 && mapping.parentPath) {
        // Show level 3 if parent is expanded and grandparent is expanded
        const parent = filteredMappings.find(m => m.path === mapping.parentPath);
        if (parent?.isExpanded) {
          const grandParent = filteredMappings.find(m => m.path === parent.parentPath);
          if (grandParent?.isExpanded) {
            visibleMappings.push(mapping);
          }
        }
      } else if (mapping.level === 4 && mapping.parentPath) {
        // Show level 4 if all ancestors are expanded
        const parent = filteredMappings.find(m => m.path === mapping.parentPath);
        if (parent?.isExpanded) {
          const grandParent = filteredMappings.find(m => m.path === parent.parentPath);
          if (grandParent?.isExpanded) {
            const greatGrandParent = filteredMappings.find(m => m.path === grandParent.parentPath);
            if (greatGrandParent?.isExpanded) {
              visibleMappings.push(mapping);
            }
          }
        }
      } else if (mapping.level === 5 && mapping.parentPath) {
        // Show level 5 if all ancestors are expanded
        const parent = filteredMappings.find(m => m.path === mapping.parentPath);
        if (parent?.isExpanded) {
          const grandParent = filteredMappings.find(m => m.path === parent.parentPath);
          if (grandParent?.isExpanded) {
            const greatGrandParent = filteredMappings.find(m => m.path === grandParent.parentPath);
            if (greatGrandParent?.isExpanded) {
              const greatGreatGrandParent = filteredMappings.find(m => m.path === greatGrandParent.parentPath);
              if (greatGreatGrandParent?.isExpanded) {
                visibleMappings.push(mapping);
              }
            }
          }
        }
      }
    });
    
    return visibleMappings;
  };

  const handleToggleExpand = (mappingPath: string) => {
    setWorkCategoryMappings(prevMappings =>
      prevMappings.map(mapping =>
        mapping.path === mappingPath
          ? { ...mapping, isExpanded: !mapping.isExpanded }
          : mapping
      )
    );
  };

  const handleCategoryToggle = (
    mapping: WorkCategoryMapping,
    isSelected: boolean
  ) => {
    if (isSelected) {
      // Get all child mappings when selecting a parent
      const childMappings = getChildMappings(mapping);
      const newCategories: SelectedCategory[] = [];

      // Add the selected mapping and all its children
      [mapping, ...childMappings].forEach(item => {
        const categoryId = item.work_category.value || item.work_category.id;
        const subCategoryId = item.work_sub_category.value || item.work_sub_category.id;
        const levelThreeId = item.level_three?.value || item.level_three?.id;
        const levelFourId = item.level_four?.value || item.level_four?.id;
        const levelFiveId = item.level_five?.value || item.level_five?.id;

        // Only add if it's a complete path (not just a parent node)
        if (item.level === 1 && !item.hasChildren) {
          // Work category with no children
          const newCategory: SelectedCategory = {
            id: crypto.randomUUID(),
            level_one_id: categoryId || 0,
            level_one_name: item.work_category.name,
            level_two_id: 0,
            level_two_name: "",
            planned_date_start_work: "",
            planned_finish_date: "",
          };
          newCategories.push(newCategory);
        } else if (item.level >= 2 && subCategoryId && subCategoryId !== 0) {
          // Sub category and below
          const newCategory: SelectedCategory = {
            id: crypto.randomUUID(),
            level_one_id: categoryId || 0,
            level_one_name: item.work_category.name,
            level_two_id: subCategoryId || 0,
            level_two_name: item.work_sub_category.name,
            level_three_id: levelThreeId,
            level_three_name: item.level_three?.name,
            level_four_id: levelFourId,
            level_four_name: item.level_four?.name,
            level_five_id: levelFiveId,
            level_five_name: item.level_five?.name,
            planned_date_start_work: "",
            planned_finish_date: "",
          };
          newCategories.push(newCategory);
        }
      });

      setSelectedCategories((prev) => [...prev, ...newCategories]);
    } else {
      // Remove the mapping and all its children
      const childMappings = getChildMappings(mapping);
      const pathsToRemove = [mapping.path, ...childMappings.map(c => c.path)];

      setSelectedCategories((prev) =>
        prev.filter(cat => {
          const catPath = buildPathFromSelectedCategory(cat);
          return !pathsToRemove.some(path => catPath.startsWith(path));
        })
      );
    }
  };

  const getChildMappings = (parentMapping: WorkCategoryMapping): WorkCategoryMapping[] => {
    return workCategoryMappings.filter(mapping => 
      mapping.path.startsWith(parentMapping.path + '-') || 
      (mapping.parentPath && mapping.parentPath.startsWith(parentMapping.path))
    );
  };

  const buildPathFromSelectedCategory = (category: SelectedCategory): string => {
    let path = category.level_one_id.toString();
    if (category.level_two_id) path += `-${category.level_two_id}`;
    if (category.level_three_id) path += `-${category.level_three_id}`;
    if (category.level_four_id) path += `-${category.level_four_id}`;
    if (category.level_five_id) path += `-${category.level_five_id}`;
    return path;
  };

  const isCategorySelected = (mapping: WorkCategoryMapping) => {
    const mappingPath = mapping.path;
    
    return selectedCategories.some(cat => {
      const catPath = buildPathFromSelectedCategory(cat);
      return catPath === mappingPath;
    });
  };

  const handleDateChange = (
    categoryId: string,
    field: "planned_date_start_work" | "planned_finish_date",
    value: string
  ) => {
    setSelectedCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, [field]: value } : cat
      )
    );
  };

  const handleAccept = () => {

    const validateDateSelect = selectedCategories.some(cat => !cat.planned_date_start_work || !cat.planned_finish_date);

    if (validateDateSelect) {
      toast.error("Please selectt both start and end date for all selected work categories", {
        position: "top-center"
      });
      return;
    }

    onSubmit(selectedCategories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-tl-2xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between flex-shrink-0">
          <div className="bg-red-800 text-white px-3 sm:px-4 py-2 rounded-tl-2xl justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold">Select Work Categories</h2>
          </div>
        <div className="py-2 px-1 border border-gray-200 rounded-sm">
          <button onClick={onClose} className="text-red-700 hover:text-red-900">
            <IoClose size={24} />
          </button>  
          </div>  
        </div>
        
        {/* Content */}
        <div className="p-3 sm:p-6 flex-1 overflow-hidden flex flex-col">
          {/* Debug Panel - Remove this in production */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded p-2 sm:p-3 mb-4 text-xs flex-shrink-0">
            <strong>Server-side Filtering Debug:</strong><br/>
            Work Categories: {workCategories.length} | 
            Sub Categories: {workSubCategories.length} | 
            Server Filtered Mappings: {workCategoryMappings.length}<br/>
            Selected Work Category: "{selectedWorkCategory}" | 
            Selected Sub Category: "{selectedSubCategory}"<br/>
            API Call: {(selectedWorkCategory || selectedSubCategory) ? 
              `work_category_mapp_list.json?${selectedWorkCategory ? `q[id_eq]=${selectedWorkCategory}` : ''}${selectedWorkCategory && selectedSubCategory ? '&' : ''}${selectedSubCategory ? `q[work_sub_categories_id_eq]=${selectedSubCategory}` : ''}` : 
              'No filters selected'}
          </div> */}

          {/* Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6 flex-shrink-0">
            <div>
              <label className="block text-sm font-medium mb-2">
                Work Category <span className="text-red-600">*</span>
              </label>
              <SelectBox
                name="selectedWorkCategory"
                control={control}
                options={workCategoryOptions}
                placeholder="Select work category"
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
                placeholder="Select sub work category"
                required={false}
                isClearable={true}
              />
            </div>
          </div>

          {/* Results Table */}
          <div className="border rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="bg-red-800 text-white flex-shrink-0">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 p-2 sm:p-3">
                <div className="text-xs sm:text-sm font-medium">Sr.No</div>
                <div className="text-xs sm:text-sm font-medium">☐</div>
                <div className="text-xs sm:text-sm font-medium">Work Category</div>
                <div className="text-xs sm:text-sm font-medium">Sub Category</div>
                <div className="text-xs sm:text-sm font-medium">Level 3</div>
                <div className="text-xs sm:text-sm font-medium">Level 4</div>
                <div className="text-xs sm:text-sm font-medium">Level 5</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <div className="p-4 sm:p-8 text-center text-gray-500">
                  Loading mappings...
                </div>
              ) : getVisibleMappings().length === 0 ? (
                <div className="p-4 sm:p-8 text-center text-gray-500">
                  {selectedWorkCategory || selectedSubCategory
                    ? "No mappings found for selected categories"
                    : "Select work category or sub category to view mappings"}
                </div>
              ) : (
                getVisibleMappings().map((mapping, index) => (
                  <div
                    key={mapping.id}
                    className="grid grid-cols-7 gap-2 sm:gap-4 p-2 sm:p-3 border-b hover:bg-gray-50"
                  >
                    <div className="text-xs sm:text-sm">{index + 1}</div>
                    <div>
                      <input
                        type="checkbox"
                        checked={isCategorySelected(mapping)}
                        onChange={(e) =>
                          handleCategoryToggle(mapping, e.target.checked)
                        }
                        className="text-red-600 focus:ring-red-500"
                      />
                    </div>
                    
                    {/* Work Category Column */}
                    <div className="text-xs sm:text-sm break-words" style={{ paddingLeft: `${(mapping.level - 1) * 16}px` }}>
                      {mapping.level === 1 && (
                        <div className="flex items-center">
                          {mapping.hasChildren ? (
                            <button
                              onClick={() => handleToggleExpand(mapping.path)}
                              className="text-gray-400 mr-2 hover:text-gray-600 flex-shrink-0"
                            >
                              {mapping.isExpanded ? "▼" : "▶"}
                            </button>
                          ) : (
                            <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          )}
                          <span className="font-medium truncate">{mapping.work_category.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Sub Category Column */}
                    <div className="text-xs sm:text-sm break-words" style={{ paddingLeft: `${Math.max(0, (mapping.level - 2)) * 16}px` }}>
                      {mapping.level === 2 && (
                        <div className="flex items-center">
                          {mapping.hasChildren ? (
                            <button
                              onClick={() => handleToggleExpand(mapping.path)}
                              className="text-gray-400 mr-2 hover:text-gray-600 flex-shrink-0"
                            >
                              {mapping.isExpanded ? "▼" : "▶"}
                            </button>
                          ) : (
                            <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          )}
                          <span className={`truncate ${isCategorySelected(mapping) ? "text-red-600 font-medium" : ""}`}>
                            {mapping.work_sub_category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Level 3 Column */}
                    <div className="text-xs sm:text-sm break-words" style={{ paddingLeft: `${Math.max(0, (mapping.level - 3)) * 16}px` }}>
                      {mapping.level === 3 && mapping.level_three && (
                        <div className="flex items-center">
                          {mapping.hasChildren ? (
                            <button
                              onClick={() => handleToggleExpand(mapping.path)}
                              className="text-gray-400 mr-2 hover:text-gray-600 flex-shrink-0"
                            >
                              {mapping.isExpanded ? "▼" : "▶"}
                            </button>
                          ) : (
                            <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          )}
                          <span className={`truncate ${isCategorySelected(mapping) ? "text-red-600 font-medium" : ""}`}>
                            {mapping.level_three.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Level 4 Column */}
                    <div className="text-xs sm:text-sm break-words" style={{ paddingLeft: `${Math.max(0, (mapping.level - 4)) * 16}px` }}>
                      {mapping.level === 4 && mapping.level_four && (
                        <div className="flex items-center">
                          {mapping.hasChildren ? (
                            <button
                              onClick={() => handleToggleExpand(mapping.path)}
                              className="text-gray-400 mr-2 hover:text-gray-600 flex-shrink-0"
                            >
                              {mapping.isExpanded ? "▼" : "▶"}
                            </button>
                          ) : (
                            <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          )}
                          <span className={`truncate ${isCategorySelected(mapping) ? "text-red-600 font-medium" : ""}`}>
                            {mapping.level_four.name}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Level 5 Column */}
                    <div className="text-xs sm:text-sm break-words">
                      {mapping.level === 5 && mapping.level_five && (
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                          <span className={`truncate ${isCategorySelected(mapping) ? "text-red-600 font-medium" : ""}`}>
                            {mapping.level_five.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Categories Preview */}
          {selectedCategories.length > 0 && (
            <div className="mt-4 sm:mt-6 flex-shrink-0">
              <h3 className="text-sm font-medium mb-2">
                Selected Categories ({selectedCategories.length})
              </h3>
              <div className="bg-gray-50 p-3 rounded border max-h-48 sm:max-h-96 overflow-y-auto">
                {selectedCategories.map((category, index) => (
                  <div key={category.id} className="mb-4 p-3 bg-white rounded border">
                    <div className="text-xs sm:text-sm mb-2">
                      <strong>{index + 1}.</strong> {category.level_one_name} →{" "}
                      {category.level_two_name}
                      {category.level_three_name &&
                        ` → ${category.level_three_name}`}
                      {category.level_four_name &&
                        ` → ${category.level_four_name}`}
                      {category.level_five_name &&
                        ` → ${category.level_five_name}`}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-xs font-medium text-black mb-1">
                           Planned Start Date <span className="text-red-700 text-base font-bold" aria-label="required">*</span>
                        </label>
                        <input
                          type="date"
                          value={category.planned_date_start_work}
                          onChange={(e) =>
                            handleDateChange(
                              category.id,
                              "planned_date_start_work",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Planned Finish Date <span className="text-red-700 text-base font-bold" aria-label="required">*</span>
                        </label>
                        <input
                          type="date"
                          value={category.planned_finish_date}
                          onChange={(e) =>
                            handleDateChange(
                              category.id,
                              "planned_finish_date",
                              e.target.value
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 flex justify-end flex-shrink-0">
          <button
            onClick={handleAccept}
            disabled={selectedCategories.length === 0}
            className="bg-red-800 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded hover:bg-red-900 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
