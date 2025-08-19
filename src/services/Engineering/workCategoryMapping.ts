const BASE = "https://marathon.lockated.com";

// Get token from URL params or localStorage
function getToken(): string {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get("token");

  if (tokenFromUrl) {
    localStorage.setItem("auth_token", tokenFromUrl);
    return tokenFromUrl;
  }

  return (
    localStorage.getItem("token") ||
    "bfa5004e7b0175622be8f7e69b37d01290b737f82e078414"
  );
}

const TOKEN = getToken();

export interface WorkCategory {
  id: string;
  name: string;
  level: number;
  parent_id?: string;
}

export interface CategoryActivity {
  name: string;
}

export interface ActivityCategoryMapping {
  level_one_id: number;
  level_two_id: number;
  level_three_id: number;
  level_four_id: number;
  level_five_id: number;
  category_activities: CategoryActivity[];
}

export interface ActivityCategoryMappingPayload {
  activity_category_mapping: ActivityCategoryMapping;
}

// Get work categories by level and optional parent ID
export const getWorkCategories = async (level: number, parentId?: string): Promise<WorkCategory[]> => {
  try {
    let url = `${BASE}/work_categories.json?level=${level}&token=${TOKEN}`;
    if (parentId) {
      url += `&parent_id=${parentId}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories || data || [];
  } catch (error) {
    console.error('Error fetching work categories:', error);
    throw error;
  }
};

// Create activity category mapping
export const createActivityCategoryMapping = async (payload: ActivityCategoryMappingPayload) => {
  try {
    const response = await fetch(`${BASE}/activity_category_mappings.json?token=${TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating activity category mapping:', error);
    throw error;
  }
};

// Get all activity category mappings
export const getActivityCategoryMappings = async () => {
  try {
    const response = await fetch(`${BASE}/activity_category_mappings.json?token=${TOKEN}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching activity category mappings:', error);
    throw error;
  }
};

// Update activity category mapping
export const updateActivityCategoryMapping = async (id: string, payload: ActivityCategoryMappingPayload) => {
  try {
    const response = await fetch(`${BASE}/activity_category_mappings/${id}.json?token=${TOKEN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating activity category mapping:', error);
    throw error;
  }
};

// Delete activity category mapping
export const deleteActivityCategoryMapping = async (id: string) => {
  try {
    const response = await fetch(`${BASE}/activity_category_mappings/${id}.json?token=${TOKEN}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting activity category mapping:', error);
    throw error;
  }
};
