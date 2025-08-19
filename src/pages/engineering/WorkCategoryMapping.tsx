import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaTrash, FaPlus, FaSave, FaBuilding } from 'react-icons/fa';
import { getWorkCategories, createActivityCategoryMapping, type WorkCategory } from '../../services/Engineering/workCategoryMapping';

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
  category_activities: Activity[];
}

interface CategoryOption {
  id: string;
  name: string;
  level?: number;
  parent_id?: string;
}

const WorkCategoryMapping = () => {
  const [formData, setFormData] = useState<MappingFormData>({
    level_one_id: '',
    level_two_id: '',
    level_three_id: '',
    level_four_id: '',
    level_five_id: '',
    category_activities: [{ id: '1', name: '' }]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<{
    level1: CategoryOption[];
    level2: CategoryOption[];
    level3: CategoryOption[];
    level4: CategoryOption[];
    level5: CategoryOption[];
  }>({
    level1: [],
    level2: [],
    level3: [],
    level4: [],
    level5: []
  });

  // Fetch category options dynamically
  const fetchCategoryOptions = async (level: number, parentId?: string) => {
    try {
      const categories = await getWorkCategories(level, parentId);
      return categories;
    } catch (error) {
      console.error(`Error fetching level ${level} categories:`, error);
      toast.error(`Failed to load level ${level} categories`);
      return [];
    }
  };

  // Load initial level 1 categories
  useEffect(() => {
    const loadLevel1Categories = async () => {
      const level1Categories = await fetchCategoryOptions(1);
      setCategoryOptions(prev => ({ ...prev, level1: level1Categories }));
    };
    loadLevel1Categories();
  }, []);

  // Handle cascading dropdown changes
  const handleLevelChange = async (level: number, value: string) => {
    const levelKey = level === 1 ? 'one' : level === 2 ? 'two' : level === 3 ? 'three' : level === 4 ? 'four' : 'five';
    
    setFormData(prev => ({
      ...prev,
      [`level_${levelKey}_id`]: value,
      // Clear subsequent levels when parent changes
      ...(level === 1 && { level_two_id: '', level_three_id: '', level_four_id: '', level_five_id: '' }),
      ...(level === 2 && { level_three_id: '', level_four_id: '', level_five_id: '' }),
      ...(level === 3 && { level_four_id: '', level_five_id: '' }),
      ...(level === 4 && { level_five_id: '' }),
    }));

    // Load next level categories
    if (level < 5 && value) {
      const nextLevelCategories = await fetchCategoryOptions(level + 1, value);
      const nextLevelKey = `level${level + 1}` as keyof typeof categoryOptions;
      
      setCategoryOptions(prev => ({
        ...prev,
        [nextLevelKey]: nextLevelCategories,
        // Clear subsequent levels
        ...(level === 1 && { level3: [], level4: [], level5: [] }),
        ...(level === 2 && { level4: [], level5: [] }),
        ...(level === 3 && { level5: [] }),
      }));
    }
  };

  const addActivity = () => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      name: ''
    };
    setFormData(prev => ({
      ...prev,
      category_activities: [...prev.category_activities, newActivity]
    }));
  };

  const removeActivity = (id: string) => {
    setFormData(prev => ({
      ...prev,
      category_activities: prev.category_activities.filter(activity => activity.id !== id)
    }));
  };

  const updateActivity = (id: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      category_activities: prev.category_activities.map(activity =>
        activity.id === id ? { ...activity, name } : activity
      )
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.level_one_id || !formData.level_two_id || !formData.level_three_id || 
        !formData.level_four_id || !formData.level_five_id) {
      toast.error("Please select all category levels");
      return;
    }

    const validActivities = formData.category_activities.filter(activity => activity.name.trim());
    if (validActivities.length === 0) {
      toast.error("Please add at least one activity");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        activity_category_mapping: {
          level_one_id: parseInt(formData.level_one_id),
          level_two_id: parseInt(formData.level_two_id),
          level_three_id: parseInt(formData.level_three_id),
          level_four_id: parseInt(formData.level_four_id),
          level_five_id: parseInt(formData.level_five_id),
          category_activities: validActivities.map(activity => ({
            name: activity.name.trim()
          }))
        }
      };

      await createActivityCategoryMapping(payload);
      toast.success("Work category mapping created successfully");
      
      // Reset form
      setFormData({
        level_one_id: '',
        level_two_id: '',
        level_three_id: '',
        level_four_id: '',
        level_five_id: '',
        category_activities: [{ id: '1', name: '' }]
      });
    } catch {
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
            <h1 className="text-3xl font-bold text-gray-900">Work Category & Activity Mapping</h1>
          </div>
          <p className="text-gray-600">Create and manage work category mappings with multi-level hierarchy and activities</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 rounded-t-lg">
            <h2 className="text-xl font-semibold text-gray-900">Create New Mapping</h2>
          </div>
          <div className="p-6">
            {/* Category Level Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((level) => {
                const levelKey = level === 1 ? 'one' : level === 2 ? 'two' : level === 3 ? 'three' : level === 4 ? 'four' : 'five';
                const optionsKey = `level${level}` as keyof typeof categoryOptions;
                const isDisabled = level > 1 && !formData[`level_${level === 2 ? 'one' : level === 3 ? 'two' : level === 4 ? 'three' : 'four'}_id`];
                
                return (
                  <div key={level} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category Level {level} *
                    </label>
                    <select
                      value={formData[`level_${levelKey}_id`]}
                      onChange={(e) => handleLevelChange(level, e.target.value)}
                      disabled={isDisabled}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 ${
                        isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="">Select Level {level}</option>
                      {categoryOptions[optionsKey]?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Activities</h3>
                <button 
                  type="button" 
                  onClick={addActivity}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <FaPlus className="h-4 w-4" />
                  Add Activity
                </button>
              </div>

              <div className="space-y-3">
                {formData.category_activities.map((activity, index) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter activity name"
                        value={activity.name}
                        onChange={(e) => updateActivity(activity.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    {formData.category_activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeActivity(activity.id)}
                        className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t mt-8">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-8 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-800 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                }`}
              >
                <FaSave className="h-4 w-4" />
                {isSubmitting ? 'Creating Mapping...' : 'Create Mapping'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkCategoryMapping;
