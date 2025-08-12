import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import Select from "react-select";
import SelectBox from "../../../components/forms/SelectBox";
import {
  fetchProjects,
  fetchWorkCategories,
  fetchUoms,
  fetchActivities,
  fetchDescriptions,
  postServiceBoq,
  updateServiceBoq,
  fetchServiceBoq,
} from "../../../services/Engineering/serviceBoq";
import { BiBuilding, BiTrash } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";

// Types for floors
interface Floor {
  id: number;
  name: string;
  quantity?: number;
  wastage?: number;
}

// Simple option interface
interface Option {
  value: string | number;
  label: string;
}

// Types for options used by Selects
interface ServiceRow {
  id: string;
  checked: boolean;
  name: string;
  uomId?: number;
  quantity: number;
  wastage: number;
  floors?: Floor[]; // Add floors data per row
}

interface ActivityBlock {
  labourActivityId?: number;
  descriptionId?: number;
  rows: ServiceRow[];
}

type ServiceBoqFormMode = "create" | "edit" | "view";

const newRow = (i: number): ServiceRow => ({
  id: Math.random().toString(36).slice(2),
  checked: true,
  name: `Service ${i}`,
  quantity: 0,
  wastage: 0,
  floors: [], // Initialize floors as empty array
});

export default function ServiceBoqForm() {
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") as ServiceBoqFormMode) || "create";
  const boqId = searchParams.get("id");

  // Form state
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedWing, setSelectedWing] = useState("");
  const [selectedLevelOne, setSelectedLevelOne] = useState("");
  const [selectedLevelTwo, setSelectedLevelTwo] = useState("");
  // Unused state variables can be added back if needed
  // const [description, setDescription] = useState("");
  // const [levelOfApproval, setLevelOfApproval] = useState("");
  // const [boqCode, setBoqCode] = useState("");

  const [activitiesBlocks, setActivitiesBlocks] = useState<ActivityBlock[]>([
    {
      rows: [
        {
          id: crypto.randomUUID(),
          checked: false,
          name: "",
          quantity: 0,
          wastage: 0,
          floors: [], // Initialize with empty floors
        },
      ],
    },
  ]);

  const { control, watch, setValue } = useForm({
    defaultValues: {
      project: selectedProject,
      site: selectedSite,
      wing: selectedWing,
      levelOne: selectedLevelOne,
      levelTwo: selectedLevelTwo,
      levelThree: "",
      levelFour: "",
      levelFive: "",
      levelSix: "",
    },
  });

  // Watch form values to sync with state
  const watchedProject = watch("project");
  const watchedSite = watch("site");
  const watchedWing = watch("wing");
  const watchedLevelOne = watch("levelOne");
  const watchedLevelTwo = watch("levelTwo");

  // Sync form values with state variables
  useEffect(() => {
    if (watchedProject !== selectedProject) {
      setSelectedProject(watchedProject || "");
      // Reset dependent fields when project changes
      if (watchedProject !== selectedProject) {
        setSelectedSite("");
        setSelectedWing("");
        setValue("site", "");
        setValue("wing", "");
      }
    }
  }, [watchedProject, selectedProject, setValue]);

  useEffect(() => {
    if (watchedSite !== selectedSite) {
      setSelectedSite(watchedSite || "");
      // Reset dependent fields when site changes
      if (watchedSite !== selectedSite) {
        setSelectedWing("");
        setValue("wing", "");
      }
    }
  }, [watchedSite, selectedSite, setValue]);

  useEffect(() => {
    if (watchedWing !== selectedWing) {
      setSelectedWing(watchedWing || "");
    }
  }, [watchedWing, selectedWing]);

  useEffect(() => {
    if (watchedLevelOne !== selectedLevelOne) {
      setSelectedLevelOne(watchedLevelOne || "");
      // Reset dependent field when level one changes
      if (watchedLevelOne !== selectedLevelOne) {
        setSelectedLevelTwo("");
        setValue("levelTwo", "");
      }
    }
  }, [watchedLevelOne, selectedLevelOne, setValue]);

  useEffect(() => {
    if (watchedLevelTwo !== selectedLevelTwo) {
      setSelectedLevelTwo(watchedLevelTwo || "");
    }
  }, [watchedLevelTwo, selectedLevelTwo]);

  // Load existing data for edit/view mode
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && boqId) {
      const loadExistingData = async () => {
        try {
          const data = await fetchServiceBoq(boqId);
          
          // Set form values
          setValue("project", data.project_id?.toString() || "");
          setValue("site", data.subproject_id?.toString() || "");
          setValue("wing", data.wing_id?.toString() || "");
          setValue("levelOne", data.level_one_id?.toString() || "");
          setValue("levelTwo", data.level_two_id?.toString() || "");
          setValue("levelThree", data.level_three_id?.toString() || "");
          setValue("levelFour", data.level_four_id?.toString() || "");
          setValue("levelFive", data.level_five_id?.toString() || "");
          
          // Set state variables
          setSelectedProject(data.project_id?.toString() || "");
          setSelectedSite(data.subproject_id?.toString() || "");
          setSelectedWing(data.wing_id?.toString() || "");
          setSelectedLevelOne(data.level_one_id?.toString() || "");
          setSelectedLevelTwo(data.level_two_id?.toString() || "");
          
          // Set activities blocks
          if (data.boq_activities && data.boq_activities.length > 0) {
            const loadedBlocks = data.boq_activities.map((activity: any) => ({
              labourActivityId: activity.labour_activity_id,
              descriptionId: activity.description_id,
              rows: activity.boq_activity_services?.map((service: any) => ({
                id: crypto.randomUUID(),
                checked: true,
                name: service.name,
                uomId: service.uom_id,
                quantity: service.quantity || 0,
                wastage: service.wastage || 0,
                floors: service.boq_activity_services_by_floors?.map((floor: any) => ({
                  id: floor.floor_id,
                  name: `Floor ${floor.floor_id}`, // You might want to fetch floor names
                  quantity: floor.quantity || 0,
                  wastage: floor.wastage || 0,
                })) || [],
              })) || [{
                id: crypto.randomUUID(),
                checked: false,
                name: "",
                quantity: 0,
                wastage: 0,
                floors: [],
              }]
            }));
            setActivitiesBlocks(loadedBlocks);
          }
        } catch (error) {
          console.error("Failed to load Service BOQ:", error);
          toast.error("Failed to load Service BOQ data");
        }
      };

      loadExistingData();
    }
  }, [mode, boqId, setValue]);

  const isReadOnly = mode === "view";

  // API data fetching
  const [projectsData, setProjectsData] = useState<any>(null);
  const [workCats, setWorkCats] = useState<any>(null);
  const [uoms, setUoms] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Floors modal state
  const [floors, setFloors] = useState<Floor[]>([]);
  const [showFloorsModal, setShowFloorsModal] = useState(false);
  const [currentRowId, setCurrentRowId] = useState<string>("");
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          projectsRes,
          workCatsRes,
          uomsRes,
          activitiesRes,
          descriptionsRes,
        ] = await Promise.all([
          fetchProjects(),
          fetchWorkCategories(),
          fetchUoms(),
          fetchActivities(),
          fetchDescriptions(),
        ]);

        setProjectsData(projectsRes);
        setWorkCats(workCatsRes);
        setUoms(uomsRes);
        setActivities(activitiesRes);
        setDescriptions(descriptionsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Derived options
  const projectOptions: Option[] = useMemo(
    () =>
      (projectsData?.projects || []).map((p: any) => ({
        value: p.id,
        label: p.formatted_name,
      })),
    [projectsData]
  );

  const siteOptions: Option[] = useMemo(() => {
    if (!selectedProject) return [];
    const project = (projectsData?.projects || []).find(
      (p: any) => p.id === parseInt(selectedProject)
    );
    return (project?.pms_sites || []).map((s: any) => ({
      value: s.id,
      label: s.name,
    }));
  }, [projectsData, selectedProject]);

  const wingOptions: Option[] = useMemo(() => {
    if (!selectedProject || !selectedSite) return [];
    const project = (projectsData?.projects || []).find(
      (p: any) => p.id === parseInt(selectedProject)
    );
    const site = project?.pms_sites?.find(
      (s: any) => s.id === parseInt(selectedSite)
    );
    return (site?.pms_wings || []).map((w: any) => ({
      value: w.id,
      label: w.name,
    }));
  }, [projectsData, selectedProject, selectedSite]);

  // Work categories hierarchy (Level 1 -> Level 2). Future levels left flexible.
  const levelOneOptions: Option[] = useMemo(
    () =>
      (workCats?.work_categories || []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [workCats]
  );
  const levelTwoOptions: Option[] = useMemo(() => {
    if (!selectedLevelOne) return [];
    const c = (workCats?.work_categories || []).find(
      (x: any) => x.id === parseInt(selectedLevelOne)
    );
    return (c?.work_sub_categories || []).map((s: any) => ({
      value: s.id,
      label: s.name,
    }));
  }, [workCats, selectedLevelOne]);

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
        (p: any) => p.id === projectId
      );
      if (project) {
        setSelectedProject(project.id.toString());

        const sites = project.pms_sites || [];
        if (siteId) {
          const site = sites.find((s: any) => s.id === siteId);
          if (site) {
            setSelectedSite(site.id.toString());

            const wings = site.pms_wings || [];
            if (wingId) {
              const wing = wings.find((w: any) => w.id === wingId);
              if (wing) setSelectedWing(wing.id.toString());
            }
          }
        }
      }
    }
  }, [projectsData, searchParams]);

  // Fetch floors based on wing selection
  const fetchFloors = async (wingId: number) => {
    try {
      const url = `https://marathon.lockated.com/pms/floors.json?q[wing_id_eq]=${wingId}&token=bfa5004e7b0175622be8f7e69b37d01290b737f82e078414`;
      console.log("Fetching floors from:", url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Raw floors API response:", data); 
      
      let floors = [];
      
      // Handle different possible response structures
      if (data.floors) {
        floors = data.floors;
      } else if (Array.isArray(data)) {
        floors = data;
      } else if (data.data) {
        floors = data.data;
      } else {
        console.warn("Unexpected floors API response structure:", data);
        floors = [];
      }
      
      console.log("Processed floors:", floors);
      return floors;
    } catch (error) {
      console.error("Error fetching floors:", error);
      toast.error("Failed to fetch floors");
      return [];
    }
  };

  // Watch for wing changes to fetch floors
  useEffect(() => {
    if (selectedWing) {
      const wingId = parseInt(selectedWing);
      if (wingId) {
        fetchFloors(wingId).then(setFloors);
      }
    }
  }, [selectedWing]);

  const handleAddActivity = () => {
    setActivitiesBlocks((prev) => [...prev, { rows: [newRow(1)] }]); // Fixed: only add one row
  };

  const handleAddRow = (i: number) => {
    setActivitiesBlocks((prev) => {
      const next = [...prev];
      const currentRows = next[i].rows;
      const newRowData = newRow(currentRows.length + 1);
      next[i].rows = [...currentRows, newRowData];
      return next;
    });
  };

  const handleRemoveRow = (activityIndex: number, rowId: string) => {
    setActivitiesBlocks((prev) => {
      const next = [...prev];
      next[activityIndex].rows = next[activityIndex].rows.filter(
        (r) => r.id !== rowId
      );
      return next;
    });
  };

  const handleOpenFloorsModal = (activityIndex: number, rowId: string) => {
    console.log("Opening floors modal for activity", activityIndex, "row", rowId);
    console.log("Selected wing:", selectedWing);
    
    setCurrentActivityIndex(activityIndex);
    setCurrentRowId(rowId);
    
    // Load existing floor data for this specific row
    const currentRow = activitiesBlocks[activityIndex].rows.find(r => r.id === rowId);
    console.log("Current row:", currentRow);
    
    if (currentRow && currentRow.floors && currentRow.floors.length > 0) {
      // Row has existing floor data, use it
      console.log("Using existing floor data:", currentRow.floors);
      setFloors([...currentRow.floors]);
    } else {
      // No existing floor data, fetch from API
      if (selectedWing) {
        console.log("Fetching floors for wing:", selectedWing);
        fetchFloors(parseInt(selectedWing)).then((fetchedFloors) => {
          console.log("Fetched floors for modal:", fetchedFloors);
          
          // If no floors found, create some mock data for testing
          if (!fetchedFloors || fetchedFloors.length === 0) {
            console.log("No floors found, creating mock floors for testing");
            const mockFloors = [
              { id: 1, name: "Ground Floor", quantity: 0, wastage: 0 },
              { id: 2, name: "First Floor", quantity: 0, wastage: 0 },
              { id: 3, name: "Second Floor", quantity: 0, wastage: 0 }
            ];
            setFloors(mockFloors);
          } else {
            setFloors(fetchedFloors);
          }
        });
      } else {
        console.warn("No wing selected, cannot fetch floors");
        setFloors([]);
      }
    }
    
    setShowFloorsModal(true);
  };

  const handleFloorsSubmit = () => {
    // Get current row data
    const currentRow = activitiesBlocks[currentActivityIndex].rows.find(
      (r) => r.id === currentRowId
    );

    if (currentRow) {
      const currentRowTotal =
        (currentRow.quantity || 0) + (currentRow.wastage || 0);
      const floorsTotal = floors.reduce(
        (sum, floor) => sum + (floor.quantity || 0) + (floor.wastage || 0),
        0
      );

      // Validate that floors total doesn't exceed row total
      if (floorsTotal > currentRowTotal) {
        toast.error(
          `Floors total (${floorsTotal}) cannot exceed row total (${currentRowTotal})`
        );
        return;
      }

      // Save floor data to the specific service row
      setActivitiesBlocks((prev) => {
        const next = [...prev];
        const row = next[currentActivityIndex].rows.find(r => r.id === currentRowId);
        if (row) {
          row.floors = [...floors]; // Save floors data to the specific row
        }
        return next;
      });

      // Close modal
      setShowFloorsModal(false);
      toast.success("Floor quantities updated successfully");
    }
  };

  const handleDeleteRows = (i: number) => {
    setActivitiesBlocks((prev) => {
      const next = [...prev];
      next[i].rows = next[i].rows.filter((r) => !r.checked);
      return next;
    });
  };

  // Remove an entire activity block
  const handleRemoveActivity = (i: number) => {
    setActivitiesBlocks((prev) => prev.filter((_, idx) => idx !== i));
  };

  const setRow = (
    i: number,
    rowId: string,
    updater: (r: ServiceRow) => ServiceRow
  ) => {
    setActivitiesBlocks((prev) => {
      const next = [...prev];
      next[i].rows = next[i].rows.map((r) => (r.id === rowId ? updater(r) : r));
      return next;
    });
  };

  const disabled = isReadOnly;

  const onSubmit = async (formData: any) => {
    if (
      !formData.project ||
      !formData.site ||
      !formData.wing ||
      !formData.levelOne
    ) {
      toast.error("Please complete required fields");
      return;
    }

    // Check if there are any valid activity blocks
    const validActivities = activitiesBlocks.filter(blk => 
      blk.labourActivityId && 
      blk.descriptionId && 
      blk.rows.some(r => r.checked && r.name && r.name.trim() !== "")
    );

    if (validActivities.length === 0) {
      toast.error("Please add at least one activity with services");
      return;
    }

    const payload = {
      service_boq: {
        project_id: parseInt(formData.project),
        subproject_id: parseInt(formData.site),
        wing_id: parseInt(formData.wing),
        level_one_id: parseInt(formData.levelOne),
        level_two_id: formData.levelTwo ? parseInt(formData.levelTwo) : null,
        level_three_id: formData.levelThree ? parseInt(formData.levelThree) : null,
        level_four_id: formData.levelFour ? parseInt(formData.levelFour) : null,
        level_five_id: formData.levelFive ? parseInt(formData.levelFive) : null,
        boq_activities_attributes: activitiesBlocks
          .filter(blk => blk.labourActivityId && blk.descriptionId)
          .map((blk) => {
          const filteredRows = blk.rows.filter(r => 
            r.checked && r.name && r.name.trim() !== ""
          );
          
          return {
            labour_activity_id: blk.labourActivityId,
            description_id: blk.descriptionId,
            boq_activity_services_attributes: filteredRows.map((r) => ({
              name: r.name,
              uom_id: r.uomId,
              quantity: r.quantity || 0,
              wastage: r.wastage || 0,
              total_qty: (r.quantity || 0) + (r.wastage || 0),
              boq_activity_services_by_floors_attributes: (r.floors || [])
                .filter(f => f.quantity && f.quantity > 0) // Only include floors with quantities
                .map(f => ({
                  floor_id: f.id,
                  quantity: f.quantity || 0,
                  wastage: f.wastage || 0,
                })),
            })),
          };
        }),
      },
    };

    try {
      if (mode === "edit" && boqId) {
        await updateServiceBoq(boqId, payload);
        toast.success("Service BOQ updated successfully");
      } else {
        await postServiceBoq(payload);
        toast.success("Service BOQ created successfully");
      }
    } catch (e: any) {
      toast.error(e?.message || `Failed to ${mode === "edit" ? "update" : "create"} Service BOQ`);
    }
  };

  const uomOptions: Option[] = useMemo(() => {
    console.log("UOM data:", uoms);
    const options = (uoms || []).map((u: any) => ({
      value: u.id,
      label: u.uom_short_name || u.name,
    }));
    console.log("UOM Options:", options);
    return options;
  }, [uoms]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container max-w-7xl mx-auto py-8 px-4">
        {/* SEO basics */}
        <TitleSEO
          title={`Service BOQ • ${mode}`}
          description="Create or manage Service BOQ"
        />

        <div className="bg-white shadow-lg p-4 rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-0">
              {mode === "edit" ? "Edit BOQ" : mode === "view" ? "View BOQ" : "Create BOQ"}
            </h1>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = {
              project: selectedProject,
              site: selectedSite,
              wing: selectedWing,
              levelOne: selectedLevelOne,
              levelTwo: selectedLevelTwo,
              levelThree: watch("levelThree"),
              levelFour: watch("levelFour"),
              levelFive: watch("levelFive"),
            };
            onSubmit(formData);
          }}>
            <div className="p-6">
            {/* Top grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Project *
                </label>
                <SelectBox
                  name="project"
                  control={control}
                  options={projectOptions}
                  placeholder="Select Project"
                  isDisabled={disabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub-Project *
                </label>
                <SelectBox
                  name="site"
                  control={control}
                  options={siteOptions}
                  placeholder="Select Sub-Project"
                  isDisabled={disabled || !selectedProject}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Wing *</label>
                <SelectBox
                  name="wing"
                  control={control}
                  options={wingOptions}
                  placeholder="Select Wing"
                  isDisabled={disabled || !selectedSite}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Work Category *
                </label>
                <SelectBox
                  name="levelOne"
                  control={control}
                  options={levelOneOptions}
                  placeholder="Select work category"
                  isDisabled={disabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub work Category *
                </label>
                <SelectBox
                  name="levelTwo"
                  control={control}
                  options={levelTwoOptions}
                  placeholder="Select Sub work category"
                  isDisabled={disabled || !selectedLevelOne}
                />
              </div>
            </div>

            {/* Additional Category Levels Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category Level 2
                </label>
                <SelectBox
                  name="levelThree"
                  control={control}
                  options={[]} // You can add options here when available
                  placeholder="Select Sub work category"
                  isDisabled={disabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category Level 3
                </label>
                <SelectBox
                  name="levelFour"
                  control={control}
                  options={[]} // You can add options here when available
                  placeholder="Select Sub work category"
                  isDisabled={disabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category Level 4
                </label>
                <SelectBox
                  name="levelFive"
                  control={control}
                  options={[]} // You can add options here when available
                  placeholder="Select Sub work category"
                  isDisabled={disabled}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Sub Category Level 5
                </label>
                <SelectBox
                  name="levelSix"
                  control={control}
                  options={[]} // You can add options here when available
                  placeholder="Select Sub work category"
                  isDisabled={disabled}
                />
              </div>
            </div>
          </div>

          {/* Activity Blocks */}
          {activitiesBlocks.map((blk, i) => {
            const descrOptions: Option[] = (descriptions || [])
              .filter(
                (d: any) =>
                  !blk.labourActivityId ||
                  (d.resource_type === "LabourActivity" &&
                    d.resource_id === blk.labourActivityId)
              )
              .map((d: any) => ({ value: d.id, label: d.name }));

            return (
              <div
                key={i}
                className="bg-white shadow-lg rounded-xl border border-gray-200 mb-6"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                      onClick={() => handleRemoveActivity(i)}
                      disabled={disabled}
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Select Activity *
                      </label>
                      <Select
                        value={
                          blk.labourActivityId
                            ? {
                                value: blk.labourActivityId,
                                label:
                                  (activities || []).find(
                                    (a: any) => a.id === blk.labourActivityId
                                  )?.name || "Unknown",
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          const id = selectedOption
                            ? typeof selectedOption.value === "string"
                              ? parseInt(selectedOption.value)
                              : selectedOption.value
                            : undefined;
                          setActivitiesBlocks((prev) => {
                            const next = [...prev];
                            next[i].labourActivityId = id;
                            next[i].descriptionId = undefined;
                            return next;
                          });
                        }}
                        options={[
                          { label: "Select Activity", value: "" },
                          ...(activities || []).map((a: any) => ({
                            value: a.id,
                            label: a.name,
                          })),
                        ]}
                        placeholder="Select Activity"
                        isClearable
                        isDisabled={disabled}
                        className="w-full"
                        classNamePrefix="react-select"
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#911717",
                            primary: "#911717",
                          },
                        })}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: disabled ? "#f3f4f6" : "white",
                            borderColor: "#8a93a3",
                            borderRadius: "0.375rem",
                            boxShadow: state.isFocused
                              ? "0 0 0 1px #911717"
                              : "none",
                            cursor: disabled ? "not-allowed" : "pointer",
                            "&:hover": {
                              borderColor: "#911717",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color: disabled ? "#d1d5db" : "#b91c1c",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            marginTop: 0,
                            borderRadius: "0.375rem",
                            overflow: "hidden",
                            zIndex: 50,
                          }),
                          menuList: (base) => ({
                            ...base,
                            paddingTop: 0,
                            paddingBottom: 0,
                            maxHeight: "200px",
                            overflowY: "auto",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#911717"
                              : "white",
                            color: state.isFocused ? "white" : "black",
                            cursor: disabled ? "not-allowed" : "pointer",
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Activity Description *
                      </label>
                      <Select
                        value={
                          blk.descriptionId
                            ? descrOptions.find(
                                (d) => d.value === blk.descriptionId
                              ) || null
                            : null
                        }
                        onChange={(selectedOption) => {
                          const id = selectedOption
                            ? typeof selectedOption.value === "string"
                              ? parseInt(selectedOption.value)
                              : selectedOption.value
                            : undefined;
                          setActivitiesBlocks((prev) => {
                            const next = [...prev];
                            next[i].descriptionId = id;
                            return next;
                          });
                        }}
                        options={[
                          { label: "Select Description", value: "" },
                          ...descrOptions,
                        ]}
                        placeholder="Select Description"
                        isClearable
                        isDisabled={disabled || !blk.labourActivityId}
                        className="w-full"
                        classNamePrefix="react-select"
                        theme={(theme) => ({
                          ...theme,
                          colors: {
                            ...theme.colors,
                            primary25: "#911717",
                            primary: "#911717",
                          },
                        })}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor:
                              disabled || !blk.labourActivityId
                                ? "#f3f4f6"
                                : "white",
                            borderColor: "#8a93a3",
                            borderRadius: "0.375rem",
                            boxShadow: state.isFocused
                              ? "0 0 0 1px #911717"
                              : "none",
                            cursor:
                              disabled || !blk.labourActivityId
                                ? "not-allowed"
                                : "pointer",
                            "&:hover": {
                              borderColor: "#911717",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "black",
                          }),
                          dropdownIndicator: (base) => ({
                            ...base,
                            color:
                              disabled || !blk.labourActivityId
                                ? "#d1d5db"
                                : "#b91c1c",
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            marginTop: 0,
                            borderRadius: "0.375rem",
                            overflow: "hidden",
                            zIndex: 50,
                          }),
                          menuList: (base) => ({
                            ...base,
                            paddingTop: 0,
                            paddingBottom: 0,
                            maxHeight: "200px",
                            overflowY: "auto",
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused
                              ? "#911717"
                              : "white",
                            color: state.isFocused ? "white" : "black",
                            cursor:
                              disabled || !blk.labourActivityId
                                ? "not-allowed"
                                : "pointer",
                          }),
                        }}
                      />
                    </div>
                  </div>

                  <div className="rounded-md border overflow-hidden">
                    <div className="bg-primary text-primary-foreground px-4 py-2 font-medium">
                      Services
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-white bg-red-800">
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Sr.No
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Select
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Name
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              UOM
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Quantity
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Add Wastage
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Total Quantity
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Floors
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {blk.rows.map((r, idx) => {
                            const total =
                              (Number(r.quantity) || 0) +
                              (Number(r.wastage) || 0);
                            return (
                              <tr key={r.id} className="border-b">
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">
                                  <input
                                    type="checkbox"
                                    checked={r.checked}
                                    onChange={(e) =>
                                      setRow(i, r.id, (cur) => ({
                                        ...cur,
                                        checked: e.target.checked,
                                      }))
                                    }
                                    disabled={disabled}
                                    className="rounded"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="text"
                                    value={r.name}
                                    onChange={(e) =>
                                      setRow(i, r.id, (cur) => ({
                                        ...cur,
                                        name: e.target.value,
                                      }))
                                    }
                                    disabled={disabled}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <Select
                                    value={
                                      r.uomId
                                        ? uomOptions.find(
                                            (u) => u.value === r.uomId
                                          ) || null
                                        : null
                                    }
                                    onChange={(selectedOption) =>
                                      setRow(i, r.id, (cur) => ({
                                        ...cur,
                                        uomId: selectedOption
                                          ? (selectedOption.value as number)
                                          : undefined,
                                      }))
                                    }
                                    options={[
                                      { label: "Select UOM", value: "" },
                                      ...uomOptions,
                                    ]}
                                    placeholder="Select UOM"
                                    isClearable
                                    isDisabled={disabled}
                                    className="w-full"
                                    classNamePrefix="react-select"
                                    menuPlacement="bottom"
                                    menuPortalTarget={document.body}
                                    theme={(theme) => ({
                                      ...theme,
                                      colors: {
                                        ...theme.colors,
                                        primary25: "#911717",
                                        primary: "#911717",
                                      },
                                    })}
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        backgroundColor: disabled
                                          ? "#f3f4f6"
                                          : "white",
                                        borderColor: "#8a93a3",
                                        borderRadius: "0.375rem",
                                        boxShadow: state.isFocused
                                          ? "0 0 0 1px #911717"
                                          : "none",
                                        cursor: disabled
                                          ? "not-allowed"
                                          : "pointer",
                                        minHeight: "32px",
                                        fontSize: "14px",
                                        "&:hover": {
                                          borderColor: "#911717",
                                        },
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        color: "black",
                                      }),
                                      dropdownIndicator: (base) => ({
                                        ...base,
                                        color: disabled ? "#d1d5db" : "#b91c1c",
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 99999,
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        backgroundColor: "white",
                                        marginTop: 4,
                                        borderRadius: "0.375rem",
                                        overflow: "hidden",
                                        zIndex: 99999,
                                        boxShadow:
                                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                      }),
                                      menuList: (base) => ({
                                        ...base,
                                        paddingTop: 0,
                                        paddingBottom: 0,
                                        maxHeight: "200px",
                                        overflowY: "auto",
                                      }),
                                      option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isFocused
                                          ? "#911717"
                                          : "white",
                                        color: state.isFocused
                                          ? "white"
                                          : "black",
                                        cursor: disabled
                                          ? "not-allowed"
                                          : "pointer",
                                      }),
                                    }}
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    value={r.quantity}
                                    onChange={(e) =>
                                      setRow(i, r.id, (cur) => ({
                                        ...cur,
                                        quantity: Number(e.target.value),
                                      }))
                                    }
                                    disabled={disabled}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    value={r.wastage}
                                    onChange={(e) =>
                                      setRow(i, r.id, (cur) => ({
                                        ...cur,
                                        wastage: Number(e.target.value),
                                      }))
                                    }
                                    disabled={disabled}
                                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <input
                                    type="number"
                                    value={total}
                                    readOnly
                                    className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <BiBuilding
                                    className={`rounded cursor-pointer border text-xl p-1 ${
                                      r.floors && r.floors.length > 0 && r.floors.some(f => f.quantity && f.quantity > 0)
                                        ? 'border-green-700 text-green-700 bg-green-50 hover:bg-green-100' // Has floor data
                                        : 'border-red-700 text-red-700 hover:bg-red-50' // No floor data
                                    }`}
                                    onClick={() =>
                                      handleOpenFloorsModal(i, r.id)
                                    }
                                    title={
                                      r.floors && r.floors.length > 0 && r.floors.some(f => f.quantity && f.quantity > 0)
                                        ? 'Floor data configured'
                                        : 'Click to configure floors'
                                    }
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveRow(i, r.id)}
                                    disabled={disabled}
                                    className="text-red-600 hover:text-red-800 p-1"
                                  >
                                    <FaTrash />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex gap-4 px-4 py-3">
                      <button
                        type="button"
                        className="text-red-800 rounded-md border-red-700 border p-2"
                        onClick={() => handleAddRow(i)}
                        disabled={disabled}
                      >
                        + Add
                      </button>
                      <button
                        type="button"
                        className="text-destructive p-2 border border-red-700 rounded-md"
                        onClick={() => handleDeleteRows(i)}
                        disabled={disabled}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    className="text-red-800 underline px-4 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium"
                    onClick={handleAddActivity}
                    disabled={disabled}
                  >
                    Add Activity
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-end p-6 bg-gray-50 rounded-b-xl">
            {mode !== "view" && (
              <button
                type="submit"
                className="bg-red-800 hover:bg-red-900 text-white px-8 py-2 rounded-lg font-medium shadow-md transition-all duration-200 hover:shadow-lg"
              >
                {mode === "edit" ? "Update" : "Create"}
              </button>
            )}
          </div>
          </form>
        </div>
      </main>

      {/* Floors Modal */}
      {showFloorsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Select Floors and Quantities
              </h2>
              <button
                type="button"
                onClick={() => setShowFloorsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-4 space-y-2">
              <div className="text-sm text-gray-600">
                Current row total:{" "}
                {currentRowId &&
                activitiesBlocks[currentActivityIndex]?.rows?.find(
                  (r) => r.id === currentRowId
                )
                  ? (() => {
                      const currentRow = activitiesBlocks[
                        currentActivityIndex
                      ].rows.find((r) => r.id === currentRowId);
                      return (
                        (currentRow?.quantity || 0) + (currentRow?.wastage || 0)
                      );
                    })()
                  : 0}
              </div>
              <div className="text-sm text-gray-600">
                Floors total:{" "}
                {floors.reduce(
                  (sum, floor) =>
                    sum + (floor.quantity || 0) + (floor.wastage || 0),
                  0
                )}
              </div>
              {(() => {
                const currentRow =
                  currentRowId &&
                  activitiesBlocks[currentActivityIndex]?.rows?.find(
                    (r) => r.id === currentRowId
                  );
                const currentRowTotal = currentRow
                  ? (currentRow.quantity || 0) + (currentRow.wastage || 0)
                  : 0;
                const floorsTotal = floors.reduce(
                  (sum, floor) =>
                    sum + (floor.quantity || 0) + (floor.wastage || 0),
                  0
                );

                if (floorsTotal > currentRowTotal) {
                  return (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ Warning: Floors total ({floorsTotal}) exceeds row total
                      ({currentRowTotal})
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left border-b">Floor Name</th>
                    <th className="px-4 py-2 text-left border-b">Quantity</th>
                    <th className="px-4 py-2 text-left border-b">Wastage</th>
                    <th className="px-4 py-2 text-left border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    console.log("Rendering floors in modal:", floors);
                    console.log("Floors length:", floors.length);
                    return floors.map((floor, idx) => {
                    // Calculate current row total
                    const currentRow =
                      currentRowId &&
                      activitiesBlocks[currentActivityIndex]?.rows?.find(
                        (r) => r.id === currentRowId
                      );
                    const currentRowTotal = currentRow
                      ? (currentRow.quantity || 0) + (currentRow.wastage || 0)
                      : 0;

                    // Calculate total from other floors (excluding current floor)
                    const otherFloorsTotal = floors.reduce((sum, f, i) => {
                      if (i === idx) return sum; // Skip current floor
                      return sum + (f.quantity || 0) + (f.wastage || 0);
                    }, 0);

                    // Calculate maximum allowed for current floor
                    const maxAllowedForThisFloor = Math.max(
                      0,
                      currentRowTotal - otherFloorsTotal
                    );

                    return (
                      <tr key={floor.id} className="border-b">
                        <td className="px-4 py-2">{floor.name}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={floor.quantity || 0}
                            onChange={(e) => {
                              const inputValue = Number(e.target.value);
                              const maxQuantity = Math.max(
                                0,
                                maxAllowedForThisFloor - (floor.wastage || 0)
                              );
                              const newQuantity = Math.min(
                                inputValue,
                                maxQuantity
                              );

                              const newFloors = [...floors];
                              newFloors[idx] = {
                                ...floor,
                                quantity: newQuantity,
                              };
                              setFloors(newFloors);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                            max={Math.max(
                              0,
                              maxAllowedForThisFloor - (floor.wastage || 0)
                            )}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={floor.wastage || 0}
                            onChange={(e) => {
                              const inputValue = Number(e.target.value);
                              const maxWastage = Math.max(
                                0,
                                maxAllowedForThisFloor - (floor.quantity || 0)
                              );
                              const newWastage = Math.min(
                                inputValue,
                                maxWastage
                              );

                              const newFloors = [...floors];
                              newFloors[idx] = {
                                ...floor,
                                wastage: newWastage,
                              };
                              setFloors(newFloors);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            min="0"
                            max={Math.max(
                              0,
                              maxAllowedForThisFloor - (floor.quantity || 0)
                            )}
                          />
                        </td>
                        <td className="px-4 py-2">
                          {(floor.quantity || 0) + (floor.wastage || 0)}
                        </td>
                      </tr>
                    );
                  });})()}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowFloorsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFloorsSubmit}
                disabled={(() => {
                  const currentRow =
                    currentRowId &&
                    activitiesBlocks[currentActivityIndex]?.rows?.find(
                      (r) => r.id === currentRowId
                    );
                  const currentRowTotal = currentRow
                    ? (currentRow.quantity || 0) + (currentRow.wastage || 0)
                    : 0;
                  const floorsTotal = floors.reduce(
                    (sum, floor) =>
                      sum + (floor.quantity || 0) + (floor.wastage || 0),
                    0
                  );
                  return floorsTotal > currentRowTotal;
                })()}
                className={`px-4 py-2 text-white rounded ${(() => {
                  const currentRow =
                    currentRowId &&
                    activitiesBlocks[currentActivityIndex]?.rows?.find(
                      (r) => r.id === currentRowId
                    );
                  const currentRowTotal = currentRow
                    ? (currentRow.quantity || 0) + (currentRow.wastage || 0)
                    : 0;
                  const floorsTotal = floors.reduce(
                    (sum, floor) =>
                      sum + (floor.quantity || 0) + (floor.wastage || 0),
                    0
                  );
                  return floorsTotal > currentRowTotal
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700";
                })()}`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TitleSEO = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  useEffect(() => {
    document.title = title.length > 60 ? `${title.slice(0, 57)}...` : title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description.slice(0, 160));
  }, [title, description]);
  return null;
};
