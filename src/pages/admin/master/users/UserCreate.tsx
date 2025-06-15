import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../../types/user";
import { toast } from "react-toast";
import { createUser } from "../../../../services/userService";
import { getDropdownData } from "../../../../services/dropDownService";
import { useForm } from "react-hook-form";
import SelectBox from "../../../../components/forms/SelectBox";
import { mapToOptions } from "../../../../utils";
import { label } from "framer-motion/client";

export default function UserCreate() {
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, control } = useForm<User>();

  const [dropdowns, setDropdowns] = useState({
    companies: [],
    branches: [],
    departments: [],
    designations: [],
    roles: [],
    managers: [],
    titles: [],
    divisions: [],
    bands: []
  });

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

  console.log("dropdowns", dropdowns);

  const onSubmit = async (data: User) => {
    try {
      await createUser(data);
      toast.success("User created successfully!");
      navigate("/users");
    } catch (error) {
      toast.error("Error creating user.");
      console.error(error);
    }
  };


  // Convert Raw values To dropdown data
  const titles: { id: number | string; name: string }[] =
    dropdowns?.titles || [];
  const titleOptions = titles.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const department: { id: number | string; name: string }[] =
    dropdowns?.departments || [];
  const departmentOptions = department.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const band: { id: number | string; name: string }[] = dropdowns?.bands || []
  const bandsOptions = band.map((t) => ({
    value: t.id,
    label: t.name
  }))

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
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Birth Date</label>
            <input
              {...register("birth_date", { required: true })}
              type="date"
              className="inpu borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Group Join Date</label>
            <input
              {...register("group_join_date", { required: true })}
              type="date"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Confirm Date</label>
            <input
              {...register("confirm_date", { required: true })}
              type="date"
              className="input borders  mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Last Working Date</label>
            <input
              {...register("last_working_date")}
              type="date"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Branch</label>
          <SelectBox
          name="branch_id"
          control={control}
          options={branchOptions}
          placeholder="Select Branch"
          />
          </div>

          <div className="flex flex-col">
            <label>Department</label>
            <SelectBox
              name="department_id"
              control={control}
              options={departmentOptions}
              placeholder="Select Department"
            />
          </div>

          <div className="flex flex-col">
            <label>Division</label>
            <SelectBox
            name="division_id"
            control={control}
            options={divisionOptions}
            placeholder="Select Division"
            />
          </div>

          <div className="flex flex-col">
            <label>Designation</label>
           <SelectBox
           name="designation_id"
           control={control}
           options={designationOptions}
           placeholder="Select Designation"
           />
          </div>

          <div className="flex flex-col">
            <label>Band</label>
           <SelectBox
           name="band_id"
           control={control}
           options={bandsOptions}
           placeholder="Select Band"
           />
          </div>

          <div className="flex flex-col">
            <label>Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Mobile Number</label>
            <input
              {...register("mobileNumber", { required: true })}
              placeholder="Mobile Number"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Gender</label>
            <select
              {...register("gender", { required: true })}
              className="input borders mt-1"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Username</label>
            <input
              {...register("username", { required: true })}
              placeholder="Username"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="input borders mt-1"
            />
          </div>

          <div className="flex flex-col">
            <label>Role</label>
            <SelectBox
              name="role_id"
              control={control}
              options={roleOptions}
              placeholder="Select Role"
            />
          </div>

          <div className="flex flex-col">
            <label>Access Level</label>
            <select
              {...register("accessLevelId", { required: true })}
              className="input borders mt-1"
            >
              <option value="">Select Access Level</option>
              <option value="1">Admin</option>
              <option value="2">Manager</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Access</label>
            <select
              multiple
              {...register("accessIds", { required: true })}
              className="input borders mt-1"
            >
              <option value="1">Setup</option>
              <option value="2">General</option>
              <option value="3">Purchase</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label>Wing Mapping</label>
            <input
              {...register("wingMapping")}
              placeholder="Wing Mapping"
              className="input borders"
            />
          </div>

          <div className="flex flex-col">
            <label>Gate Number</label>
            <input
              {...register("gateNumberId")}
              placeholder="Gate Number"
              className="input borders"
            />
          </div>

          {/* Submit and Cancel */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center gap-4 mt-6">
            <button type="submit" className="purple-btn2">
              Create
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
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
