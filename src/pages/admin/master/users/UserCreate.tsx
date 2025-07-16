import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toast";
import {
  createUser,
  getUserById,
  updateStatusUser,
  getGateNumbersByCategory,
  getWingsByCategory,
} from "../../../../services/Admin/userService";
import { getDropdownData } from "../../../../services/setupDropDownService";
import SelectBox from "../../../../components/forms/SelectBox";
import MultiSelectBox from "../../../../components/forms/MultiSelectBoz";
import { mapToOptions } from "../../../../utils";
import type { User } from "../../../../types/Admin/user";

type UserFormProps = {
  mode: "create" | "edit" | "details";
  isDisabled?: boolean;
};

export default function UserCreate({ mode }: UserFormProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = mode === "edit";
  const isDetails = mode === "details";

  const { register, handleSubmit, watch, control, reset } = useForm<User>();

  const [dropdowns, setDropdowns] = useState({
    companies: [],
    projects: [],
    sites: [],
    branches: [],
    departments: [],
    designations: [],
    roles: [],
    users: [],
    titles: [],
    divisions: [],
    bands: [],
    wings: [],
    associated_sites: [],
  });

  const [loading, setLoading] = useState(false);

  // console.log("associated_sites", dropdowns.associated_sites)
  console.log("dropdown", dropdowns);
  useEffect(() => {
    const subscription = watch((value) => {
      console.log("Live Values", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    getDropdownData().then(setDropdowns);
  }, []);

  // Fetch user data for edit/details
  useEffect(() => {
    if ((isEdit || isDetails) && id) {
      setLoading(true);
      getUserById(Number(id))
        .then((user) => {
          // Extract selected_ids for access level
          let selectedIds: (string | number)[] = [];
          if (user.access_level === "Sub-Project") {
            selectedIds = Array.isArray(user.selected_ids)
              ? user.selected_ids.map(
                  (item: any) => item.pms_site_id ?? item.id
                )
              : [];
          } else if (user.access_level === "Company") {
            selectedIds = Array.isArray(user.selected_ids)
              ? user.selected_ids.map((item: any) => item.company_id ?? item.id)
              : [];
          } else if (user.access_level === "Project") {
            selectedIds = Array.isArray(user.selected_ids)
              ? user.selected_ids.map((item: any) => item.project_id ?? item.id)
              : [];
          } else {
            selectedIds = Array.isArray(user.selected_ids)
              ? user.selected_ids.map((item: any) => item.id)
              : [];
          }

          // Extract only the wing IDs (array of objects or IDs)
          const selectedWingIds = Array.isArray(user.wing_ids)
            ? user.wing_ids.map((w: any) => w.id)
            : [];

          // Extract only the gate number ID
          let selectedGateNumberId = user.gate_number_id;
          if (user.gate_number_id && typeof user.gate_number_id === "object") {
            selectedGateNumberId = user.gate_number_id.id;
          }

          reset({
            ...user,
            selected_ids: selectedIds,
            wing_ids: selectedWingIds,
            gate_number_id: selectedGateNumberId,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEdit, isDetails, reset]);

  const company: { id: number | string; company_name: string }[] =
    dropdowns?.companies || [];
  // console.log("company", company);
  // const companyOptions = company.map((t) => ({
  //   value: t.id,
  //   label: t.company_name,
  // }));

  // const project: { id: number | string; formatted_name: string }[] =
  //   dropdowns?.projects || [];
  // // console.log("project", project);
  // const projectsOptions = project.map((p) => ({
  //   value: p.id,
  //   label: p.formatted_name,
  // }));

  // const sites: { id: number | string; name: string }[] = dropdowns?.sites || [];
  // // console.log("subProject", sites);
  // const subProjectOptions = sites.map((p) => ({
  //   value: p.id,
  //   label: p.name,
  // }));

  // const project: {id: number | string; name: string}[] = dropdowns?.

  const selectedAccessLevel = watch("access_level");

  // Build categoryOptions dynamically based on access level
  let categoryOptions: { value: string | number; label: string }[] = [];

  if (selectedAccessLevel === "Company") {
    categoryOptions = (dropdowns.companies || []).map((c: any) => ({
      value: c.id,
      label: c.company_name,
    }));
  } else if (selectedAccessLevel === "Project") {
    categoryOptions = (dropdowns.projects || []).map((p: any) => ({
      value: p.id,
      label: p.formatted_name,
    }));
    // console.log("project drop:", categoryOptions);
  } else if (selectedAccessLevel === "Sub-Project") {
    categoryOptions = (dropdowns.associated_sites || []).map((s: any) => ({
      value: s.id,
      label: s.name,
    }));
  } else {
    categoryOptions = [];
  }

  const accesOptions = [
    { value: "Company", label: "Company" },
    { value: "Project", label: "Project" },
    { value: "Sub-Project", label: "Sub-Project" },
  ];
  // let dynamicAccessOptions: { value: number | string; label: string }[] = [];

  // if (selectedAccessLevel === "Company") {
  //   dynamicAccessOptions = companyOptions;
  // } else if (selectedAccessLevel === "Project") {
  //   dynamicAccessOptions = projectsOptions;
  // } else if (selectedAccessLevel === "Sub-Project") {
  //   dynamicAccessOptions = subProjectOptions;
  // }
  // const [categoryData, setCategoryData] = useState<unknown>(null);
  // type CategoryItem = { id: string | number; name: string };

  // const categoryOptions2 = ((categoryData as CategoryItem[]) || []).map(
  //   (t) => ({
  //     value: t.id,
  //     label: t.name,
  //   })
  // );
  // console.log("options", categoryOptions);

  // useEffect(() => {
  //   async function fetchCategory() {
  //     if (selectedAccessLevel) {
  //       const data = await getCategoryData(selectedAccessLevel);
  //       setCategoryData(data);

  //       // after getting category data, fetch wings
  //       // const ids = data.map((item: unknown) => item.id);
  //       const ids = (data as CategoryItem[]).map((item) => Number(item.id));
  //       const wings = await getWingsByCategory(selectedAccessLevel, ids);
  //       const wingOptions = wings.map((w) => ({ value: w.id, label: w.name }));
  //       setWingOptions(wingOptions);
  //     }
  //   }
  //   fetchCategory();
  // }, [selectedAccessLevel]);

  const selectedAccessIds = watch("selected_ids");
  useEffect(() => {
    async function fetchWings() {
      if (
        selectedAccessLevel &&
        selectedAccessIds &&
        selectedAccessIds.length > 0
      ) {
        const ids: number[] = Array.isArray(selectedAccessIds)
          ? selectedAccessIds.map(Number)
          : selectedAccessIds.split(",").map(Number);

        const wings = await getWingsByCategory(selectedAccessLevel, ids);
        const wingOptions = wings.map((w) => ({ value: w.id, label: w.name }));
        setWingOptions(wingOptions);
      } else {
        setWingOptions([]); // clear wings if no access ids selected
      }
    }
    fetchWings();
  }, [selectedAccessLevel, selectedAccessIds]);

  type Option = { value: number; label: string };
  const [wingOptions, setWingOptions] = useState<Option[]>([]);
  const [gateOptions, setGateOptions] = useState<Option[]>([]);
  useEffect(() => {
    async function fetchGateNumbers() {
      if (
        selectedAccessLevel &&
        selectedAccessIds &&
        selectedAccessIds.length > 0
      ) {
        // Convert selectedAccessIds to number[]
        const ids: number[] = Array.isArray(selectedAccessIds)
          ? selectedAccessIds.map(Number)
          : selectedAccessIds.split(",").map(Number);

        const gateNumbers = await getGateNumbersByCategory(
          selectedAccessLevel,
          ids
        );
        const gateOptions = gateNumbers.map((g) => ({
          value: g.id,
          label: g.name,
        }));
        setGateOptions(gateOptions);
      } else {
        setGateOptions([]);
      }
    }
    fetchGateNumbers();
  }, [selectedAccessLevel, selectedAccessIds]);

  // useEffect(() => {
  //   async function fetchCategory() {
  //     if (selectedAccessLevel) {
  //       const data = await getCategoryData(selectedAccessLevel);
  //       setCategoryData(data);
  //     }
  //   }
  //   fetchCategory();
  // }, [selectedAccessLevel]);
  // const designation: { id: number | string; name: string }[] = dropdowns?.designations || []
  // const designationOptions = designation.map((t) => ({
  //   value: t.id,
  //   lable: t.name
  // }))
  // from utils it choose dropdown
  const roleOptions = mapToOptions(dropdowns.roles);
  const branchOptions = mapToOptions(dropdowns.branches);
  const divisionOptions = mapToOptions(dropdowns.divisions);
  const designationOptions = mapToOptions(dropdowns.designations);

  // Convert Raw values To dropdown data
  const titles: { id: number | string; name: string }[] =
    dropdowns?.titles || [];
  const titleOptions = titles.map((t) => ({
    value: t.id,
    label: t.name,
  }));
  // console.log("titleOptions", titleOptions);

  const department: { id: number | string; name: string }[] =
    dropdowns?.departments || [];
  const departmentOptions = department?.map((t) => ({
    value: t.id,
    label: t.name,
  }));
  // console.log("designationOptions", designationOptions);

  const band: { id: number | string; name: string }[] = dropdowns?.bands || [];
  const bandsOptions = band.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const [selectedIdsString, setSelectedIdsString] = useState("");
  // console.log(watch('department_id'))

  // console.log("ids selected", selectedIdsString);

  useEffect(() => {
    // Get current access level and selected IDs from form state
    const accessLevel = watch("access_level");
    const selectedAccessIds = watch("selected_ids") || [];

    // Build the object
    const selected_ids = {
      [accessLevel]: Array.isArray(selectedAccessIds)
        ? selectedAccessIds.map((id: string | number) => {
            // Make sure both are numbers or both are strings
            const found = categoryOptions.find(
              (opt) => String(opt.value) === String(id)
            );
            return {
              id,
              label: found?.label || "",
            };
          })
        : [],
    };

    setSelectedIdsString(JSON.stringify(selected_ids));
  }, [watch("selected_ids"), categoryOptions]);

  // On submit: create or update
  const onSubmit = async (data: User) => {
    try {
      const finalData = {
        ...data,
        selected_ids: selectedIdsString,
      };
      if (isEdit && id) {
        await updateStatusUser(Number(id), finalData);
        toast.success("User updated successfully!");
      } else {
        await createUser(finalData);
        toast.success("User created successfully!");
      }
      navigate("/admin/users");
    } catch (error) {
      toast.error("Error saving user.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500 text-lg">Loading details...</span>
        {/* You can replace with a spinner if you have one */}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center border border-gray-100 p-4 rounded-md">
      <div className="w-full bg-gray-100 max-w-[1280px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"
        >
          {/* Grouped Input Fields */}
          <div className="flex flex-col">
            <label className="font-semibold">
              Employee Code <span>*</span>
            </label>
            <input
              {...register("employee_code", { required: true })}
              placeholder="Employee Code"
              className="input borders"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Title <span>*</span>
            </label>

            <SelectBox
              name="title_id"
              control={control}
              options={titleOptions}
              placeholder="Select Title"
              isDisabled={isDetails}
            />

            {/* <select
              {...register("title_id", { required: true })}
              className="input borders"
            >
              <option value="">Select Title</option>
              {dropdowns?.titles?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
          
            </select> */}
            {/* <SelectBox<FormValues>
              name="title_id"
              placeholder="Select Title"
              control={control}
              options={titleOptions}
            /> */}
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              First Name <span>*</span>
            </label>
            <input
              {...register("firstname", { required: true })}
              placeholder="First Name"
              className=" borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Middle Name <span>*</span>
            </label>
            <input
              {...register("middlename")}
              placeholder="Middle Name"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">
              Last Name <span>*</span>
            </label>
            <input
              {...register("lastname", { required: true })}
              placeholder="Last Name"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Birth Date</label>
            <input
              {...register("birth_date", { required: true })}
              type="date"
              className="inpu borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Group Join Date</label>
            <input
              {...register("group_join_date", { required: true })}
              type="date"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Confirm Date</label>
            <input
              {...register("confirm_date", { required: true })}
              type="date"
              className="input borders  mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Last Working Date</label>
            <input
              {...register("last_working_date")}
              type="date"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Branch</label>
            <SelectBox
              name="branch_id"
              control={control}
              options={branchOptions}
              placeholder="Select Branch"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Department</label>
            <SelectBox
              name="department_id"
              control={control}
              options={departmentOptions}
              placeholder="Select Department"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Division</label>
            <SelectBox
              name="division_id"
              control={control}
              options={divisionOptions}
              placeholder="Select Division"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Designation</label>
            <SelectBox
              name="designation_id"
              control={control}
              options={designationOptions}
              placeholder="Select Designation"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Band</label>
            <SelectBox
              name="band_id"
              control={control}
              options={bandsOptions}
              placeholder="Select Band"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Mobile Number</label>
            <input
              {...register("mobile", { required: true })}
              placeholder="Mobile Number"
              className="input borders mt-1"
              disabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Gender</label>
            <select
              {...register("gender", { required: true })}
              className="input borders mt-1"
              disabled={isDetails}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Username</label>
            <input
              {...register("username", { required: !isEdit })}
              placeholder="Username"
              className="input borders mt-1"
              disabled={isDetails || isEdit}
            />
          </div>

          <div className="flex flex-col">
            <label>Password</label>
            <input
              {...register("password", { required: !isEdit })}
              type="password"
              placeholder="Password"
              className="input borders mt-1"
              disabled={isDetails || isEdit}
            />
          </div>

          <div className="flex flex-col">
            <label>Role</label>
            <SelectBox
              name="role_id"
              control={control}
              options={roleOptions}
              placeholder="Select Role"
              isDisabled={isDetails}
            />
          </div>

          <div className="flex col-span-1 mt-5">
            <h5 className="text-red-800">Allocation</h5>
          </div>
          <div className="flex flex-col">
            <label>Access Level</label>
            <SelectBox
              name="access_level"
              control={control}
              options={accesOptions}
              placeholder="Select Access Level"
              isDisabled={isDetails}
            />
          </div>

          {selectedAccessLevel && (
            <div className="flex flex-col">
              <label>Select Access IDs</label>
              <MultiSelectBox
                name="selected_ids"
                control={control}
                options={categoryOptions}
                placeholder={`Select ${selectedAccessLevel}`}
                isClearable={true}
                isDisabled={isDetails}
              />
            </div>
          )}

          <div className="flex flex-col">
            <label>Wing</label>
            <MultiSelectBox
              name="wing_ids"
              control={control}
              options={wingOptions}
              placeholder="Select Wings"
              isClearable={true}
              isDisabled={isDetails}
            />
          </div>

          <div className="flex flex-col">
            <label>Gate Number</label>
            <SelectBox
              name="gate_number_id"
              control={control}
              options={gateOptions}
              placeholder="Select Gate Number"
              isDisabled={isDetails}
            />
          </div>

          {/* Submit and Cancel */}
          <div className="flex col-span-1 md:col-span-2 lg:col-span-4 items-center  justify-center gap-4 mt-6">
            {!isDetails && (
              <button type="submit" className="purple-btn2">
                {isEdit ? "Update" : "Create"}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/setup/admin/users")}
              className="purple-btn1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
