import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaSave, FaBuilding } from "react-icons/fa";
import {
  getWorkCategories,
  createActivityCategoryMapping,
  type WorkCategory,
} from "../../../services/Engineering/workCategoryMapping";
import MultiSelectBox, {
  type Option,
} from "../../../components/forms/MultiSelectBoz";
import SelectBox from "../../../components/forms/SelectBox";

interface Activity {
  id: string;
  name: string;
}

interface MappingFormData {
  level_one_id: string;
  level_two_id: string;
  level_three_id: string;
  level_four_id: string;
  level_five_id: string;
  labour_activity_ids: number[];
}

interface CategoryOption {
  id: string;
  name: string;
  level?: number;
  parent_id?: string;
}

const WorkCategoryMapping = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [workCats, setWorkCats] = useState<{ work_categories: any[] } | null>(
    null
  );
  const [subCat, setSubCat] = useState<any[]>([]);
  console.log("workCats", workCats);
  console.log("subCat", subCat);

  // State for dynamic category levels (similar to ServiceBoqForm)
  const [levelThreeData, setLevelThreeData] = useState<{
    work_sub_categories: any[];
  } | null>(null);
  const [levelFourData, setLevelFourData] = useState<{
    work_sub_categories: any[];
  } | null>(null);
  const [levelFiveData, setLevelFiveData] = useState<{
    work_sub_categories: any[];
  } | null>(null);

  // Function to fetch work sub categories by ID (same as ServiceBoqForm)
  const fetchWorkSubCategory = useCallback(
    async (categoryId: string | number) => {
      try {
        const url = `https://marathon.lockated.com/work_sub_categories/${categoryId}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
        console.log("Fetching work sub category from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubCat(data);
        console.log("Work sub category API response:", data);
        return data;
      } catch (error) {
        console.error("Error fetching work sub category:", error);
        return null;
      }
    },
    []
  );

  const { control, watch, setValue, reset, handleSubmit } = useForm({
    defaultValues: {
      levelOne: "",
      levelTwo: "",
      levelThree: "",
      levelFour: "",
      levelFive: "",
      labour_activity_ids: [] as number[],
    },
  });

  // Watch form values
  const watchedLevelOne = watch("levelOne");
  const watchedLevelTwo = watch("levelTwo");
  const watchedLevelThree = watch("levelThree");
  const watchedLevelFour = watch("levelFour");
  const watchedLevelFive = watch("levelFive");

  // State variables to sync with form (like ServiceBoqForm)
  const [selectedLevelOne, setSelectedLevelOne] = useState("");
  const [selectedLevelTwo, setSelectedLevelTwo] = useState("");

  // Sync form values with state variables (exactly like ServiceBoqForm)
  useEffect(() => {
    if (watchedLevelOne !== selectedLevelOne) {
      setSelectedLevelOne(watchedLevelOne || "");
      // Reset dependent field when level one changes
      if (watchedLevelOne !== selectedLevelOne) {
        setSelectedLevelTwo("");
        setValue("levelTwo", "");
        setValue("levelThree", "");
        setValue("levelFour", "");
        setValue("levelFive", "");
        setLevelThreeData(null);
        setLevelFourData(null);
        setLevelFiveData(null);
      }
    }
  }, [watchedLevelOne, selectedLevelOne, setValue]);

  useEffect(() => {
    if (watchedLevelTwo !== selectedLevelTwo) {
      setSelectedLevelTwo(watchedLevelTwo || "");
      // Reset dependent fields when level two changes
      if (watchedLevelTwo !== selectedLevelTwo) {
        setValue("levelThree", "");
        setValue("levelFour", "");
        setValue("levelFive", "");
        setLevelFourData(null);
        setLevelFiveData(null);
      }
    }
  }, [watchedLevelTwo, selectedLevelTwo, setValue]);

  // Fetch level 3 data when level 2 changes (using selectedLevelTwo like ServiceBoqForm)
  useEffect(() => {
    if (selectedLevelTwo) {
      fetchWorkSubCategory(selectedLevelTwo).then((data) => {
        setLevelThreeData(data);
      });
    } else {
      setLevelThreeData(null);
    }
  }, [selectedLevelTwo, fetchWorkSubCategory]);

  // Fetch level 4 data when level 3 changes
  useEffect(() => {
    if (watchedLevelThree) {
      fetchWorkSubCategory(watchedLevelThree).then((data) => {
        setLevelFourData(data);
      });
      // Reset dependent fields
      setValue("levelFour", "");
      setValue("levelFive", "");
      setLevelFiveData(null);
    } else {
      setLevelFourData(null);
    }
  }, [watchedLevelThree, fetchWorkSubCategory, setValue]);

  // Fetch level 5 data when level 4 changes
  useEffect(() => {
    if (watchedLevelFour) {
      fetchWorkSubCategory(watchedLevelFour).then((data) => {
        setLevelFiveData(data);
      });
      // Reset dependent field
      setValue("levelFive", "");
    } else {
      setLevelFiveData(null);
    }
  }, [watchedLevelFour, fetchWorkSubCategory, setValue]);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Starting to fetch work categories and activities...");

        // Fetch work categories
        const workCatsResponse = await fetch(
          "https://marathon.lockated.com/work_categories/work_categories_and_subcategories.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );

        console.log(
          "Work categories response status:",
          workCatsResponse.status
        );

        if (!workCatsResponse.ok) {
          throw new Error(
            `Work categories API failed with status: ${workCatsResponse.status}`
          );
        }

        const workCatsData = await workCatsResponse.json();
        console.log("Work categories raw response:", workCatsData);
        console.log(
          "Work categories structure:",
          JSON.stringify(workCatsData, null, 2)
        );
        setWorkCats(workCatsData);

        // const subCategoryResp = await fetch('https://marathon.lockated.com/work_sub_categories/${categoryId}.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414')
        // const subCatData = await subCategoryResp.json();
        // setSubCat(subCatData);

        // Fetch activities (similar to ServiceBoqForm)
        const activitiesResponse = await fetch(
          "https://marathon.lockated.com/labour_activities.json?token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
        );

        console.log("Activities response status:", activitiesResponse.status);

        if (!activitiesResponse.ok) {
          throw new Error(
            `Activities API failed with status: ${activitiesResponse.status}`
          );
        }

        const activitiesData = await activitiesResponse.json();
        console.log("Activities raw response:", activitiesData);
        setActivities(activitiesData.labour_activities || activitiesData || []);

        console.log("Work categories loaded:", workCatsData);
        console.log("Activities loaded:", activitiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data: " + error.message);
      }
    };

    fetchData();
  }, []);

  // Create option arrays (similar to ServiceBoqForm)
  const levelOneOptions: Option[] = useMemo(() => {
    const options = (workCats?.work_categories || []).map((c: any) => ({
      value: c.id.toString(),
      label: c.name,
    }));
    console.log("Level One Options:", options);
    return options;
  }, [workCats]);

  const levelTwoOptions: Option[] = useMemo(() => {
    if (!selectedLevelOne) return [];

    console.log("Looking for selectedLevelOne:", selectedLevelOne);
    console.log("Available work categories:", workCats?.work_categories);

    const c = (workCats?.work_categories || []).find(
      (x: any) => x.id === parseInt(selectedLevelOne)
    );

    console.log("Found category:", c);
    console.log("Category work_sub_categories:", c?.work_sub_categories);

    const options = (c?.work_sub_categories || []).map((s: any) => ({
      value: s.id.toString(),
      label: s.name,
    }));
    console.log("Level Two Options:", options);
    return options;
  }, [workCats, selectedLevelOne]);

  const levelThreeOptions: Option[] = useMemo(() => {
    if (!selectedLevelTwo || !levelThreeData) return [];
    const options = (levelThreeData?.work_sub_categories || []).map(
      (s: any) => ({
        value: s.id.toString(),
        label: s.name,
      })
    );
    console.log("Level Three Options:", options);
    return options;
  }, [levelThreeData, selectedLevelTwo]);

  const levelFourOptions: Option[] = useMemo(() => {
    if (!watchedLevelThree || !levelFourData) return [];
    const options = (levelFourData?.work_sub_categories || []).map(
      (s: any) => ({
        value: s.id.toString(),
        label: s.name,
      })
    );
    console.log("Level Four Options:", options);
    return options;
  }, [levelFourData, watchedLevelThree]);

  const levelFiveOptions: Option[] = useMemo(() => {
    if (!watchedLevelFour || !levelFiveData) return [];
    const options = (levelFiveData?.work_sub_categories || []).map(
      (s: any) => ({
        value: s.id.toString(),
        label: s.name,
      })
    );
    console.log("Level Five Options:", options);
    return options;
  }, [levelFiveData, watchedLevelFour]);

  // Activity options for multi-select
  const activityOptions: Option[] = useMemo(() => {
    const options = (activities || []).map((activity: any) => ({
      value: activity.id,
      label: activity.name,
    }));
    console.log("Activity Options:", options);
    return options;
  }, [activities]);

  const onSubmit = async (formData: any) => {
    // Validate form
    if (
      !formData.levelOne ||
      !formData.levelTwo ||
      !formData.levelThree ||
      !formData.levelFour ||
      !formData.levelFive
    ) {
      toast.error("Please select all category levels");
      return;
    }

    if (
      !formData.labour_activity_ids ||
      formData.labour_activity_ids.length === 0
    ) {
      toast.error("Please select at least one activity");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        activity_category_mapping: {
          level_one_id: parseInt(formData.levelOne),
          level_two_id: parseInt(formData.levelTwo),
          level_three_id: parseInt(formData.levelThree),
          level_four_id: parseInt(formData.levelFour),
          level_five_id: parseInt(formData.levelFive),
          labour_activity_ids: formData.labour_activity_ids,
        },
      };

      await createActivityCategoryMapping(payload);
      toast.success("Work category mapping created successfully");

      // Reset form
      reset({
        levelOne: "",
        levelTwo: "",
        levelThree: "",
        levelFour: "",
        levelFive: "",
        labour_activity_ids: [],
      });
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to create work category mapping");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FaBuilding className="h-8 w-8 text-red-800" />
            <h1 className="text-3xl font-bold text-gray-900">
              Work Category & Activity Mapping
            </h1>
          </div>
          <p className="text-gray-600">
            Create and manage work category mappings with multi-level hierarchy
            and activities
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Mapping
              </h2>
            </div>
            <div className="p-6">
              {/* Category Level Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {/* Level 1 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Main Category *
                  </label>
                  <SelectBox
                    name="levelOne"
                    control={control}
                    options={levelOneOptions}
                    placeholder="Select Level 1"
                    isClearable={true}
                  />
                </div>

                {/* Level 2 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub-Category Level 2 *
                  </label>
                  <SelectBox
                    name="levelTwo"
                    control={control}
                    options={levelTwoOptions}
                    placeholder="Select Level 2"
                    isClearable={true}
                    isDisabled={!selectedLevelOne}
                  />
                </div>

                {/* Level 3 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Category Level 3 *
                  </label>
                  <SelectBox
                    name="levelThree"
                    control={control}
                    options={levelThreeOptions}
                    placeholder="Select Level 3"
                    isClearable={true}
                    isDisabled={!selectedLevelTwo}
                  />
                </div>

                {/* Level 4 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Category Level 4 *
                  </label>
                  <SelectBox
                    name="levelFour"
                    control={control}
                    options={levelFourOptions}
                    placeholder="Select Level 4"
                    isClearable={true}
                    isDisabled={!watchedLevelThree}
                  />
                </div>

                {/* Level 5 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sub Category Level 5 *
                  </label>
                  <SelectBox
                    name="levelFive"
                    control={control}
                    options={levelFiveOptions}
                    placeholder="Select Level 5"
                    isClearable={true}
                    isDisabled={!watchedLevelFour}
                  />
                </div>
              </div>

              {/* Activities Multi-Select Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Labour Activities
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Activities *
                  </label>
                  <MultiSelectBox
                    name="labour_activity_ids"
                    control={control}
                    options={activityOptions}
                    placeholder="Select activities"
                    isClearable={true}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center gap-2 px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  }`}
                >
                  <FaSave className="h-4 w-4" />
                  {isSubmitting ? "Creating Mapping..." : "Create Mapping"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkCategoryMapping;
