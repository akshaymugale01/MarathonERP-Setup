import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User, UserFormData, Role } from "../../../../types/Admin/user";
import { toast } from "react-toast";
import { createUser } from "../../../../services/Admin/userService";
import { getDropdownData } from "../../../../services/setupDropDownService";
import { useForm } from "react-hook-form";

interface Dropdowns {
  companies: any[];
  branches: any[];
  departments: any[];
  designations: any[];
  roles: Role[];
  managers: any[];
}

export default function UserEdit() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState<Dropdowns>({
    companies: [],
    branches: [],
    departments: [],
    designations: [],
    roles: [],
    managers: [],
  });

  console.log("dropdown", dropdowns);

  useEffect(() => {
    getDropdownData().then((data) => {
      setDropdowns({
        companies: data.companies || [],
        branches: data.branches || [],
        departments: data.departments || [],
        designations: data.designations || [],
        roles: data.roles || [],
        managers: data.users || [],
      });
    });
  }, []);

  console.log("dropdowns", dropdowns);

  const onSubmit = async (data: UserFormData) => {
    try {
      // Map form data to User interface
      const userData: Partial<User> = {
        employee_code: data.employeeCode,
        title_id: parseInt(data.title),
        firstname: data.firstName,
        middlename: data.middleName,
        lastname: data.lastName,
        birth_date: data.dateOfBirth,
        group_join_date: data.groupJoinDate,
        confirm_date: data.confirmDate,
        last_working_date: data.lastWorkingDate,
        company_id: parseInt(data.branchId.toString()),
        branch_id: parseInt(data.branchId.toString()),
        department_id: parseInt(data.departmentId.toString()),
        designation_id: parseInt(data.designationId.toString()),
        email: data.email,
        username: data.username,
        mobile: data.mobileNumber,
        role_id: parseInt(data.roleId.toString()),
        password: data.password,
        gender: data.gender,
        access_level: data.accessLevelId,
        access_ids: data.accessIds,
        wingMapping: data.wingMapping,
        gateNumberId: data.gateNumberId,
      };

      await createUser(userData);
      toast.success("User created successfully!");
      navigate("/setup/admin/users");
    } catch (error) {
      toast.error("Error creating user.");
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center border border-gray-100 p-4 rounded-md px-6">
      <div className="w-full bg-gray-100 max-w-[1280px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[1200px]"
        >
          <input
            {...register("employeeCode", { required: true })}
            placeholder="Employee Code"
            className="input"
          />

          <select {...register("title", { required: true })} className="input">
            <option value="">Select Title</option>
            <option value="Mr">Mr</option>
            <option value="Ms">Ms</option>
          </select>

          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
            className="input"
          />
          <input
            {...register("middleName")}
            placeholder="Middle Name"
            className="input"
          />
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
            className="input"
          />
          <input
            {...register("dateOfBirth", { required: true })}
            type="date"
            className="input"
          />
          <input
            {...register("groupJoinDate", { required: true })}
            type="date"
            className="input"
          />
          <input
            {...register("confirmDate", { required: true })}
            type="date"
            className="input"
          />
          <input
            {...register("lastWorkingDate")}
            type="date"
            className="input"
          />

          <select
            {...register("branchId", { required: true })}
            className="input"
          >
            <option value="">Select Branch</option>
            {dropdowns.branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            {...register("departmentId", { required: true })}
            className="input"
          >
            <option value="">Select Department</option>
            {dropdowns.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            {...register("divisionId", { required: true })}
            className="input"
          >
            <option value="">Select Division</option>
            <option value="1">Civil</option>
            <option value="2">Electrical</option>
          </select>

          <select
            {...register("designationId", { required: true })}
            className="input"
          >
            <option value="">Select Designation</option>
            {dropdowns.designations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select {...register("bandId", { required: true })} className="input">
            <option value="">Select Band</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>

          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="Email"
            className="input"
          />
          <input
            {...register("username", { required: true })}
            placeholder="Username"
            className="input"
          />
          <input
            {...register("mobileNumber", { required: true })}
            placeholder="Mobile Number"
            className="input"
          />

          <select {...register("gender", { required: true })} className="input">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            {...register("password", { required: true })}
            type="password"
            placeholder="Password"
            className="input"
          />

          <select {...register("roleId", { required: true })} className="input">
            <option value="">Select Role</option>
            {dropdowns.roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            {...register("accessLevelId", { required: true })}
            className="input"
          >
            <option value="">Select Access Level</option>
            <option value="1">Admin</option>
            <option value="2">Manager</option>
          </select>

          <select
            multiple
            {...register("accessIds", { required: true })}
            className="input"
          >
            <option value="1">Setup</option>
            <option value="2">General</option>
            <option value="3">Purchase</option>
          </select>

          <input
            {...register("wingMapping")}
            placeholder="Wing Mapping"
            className="input"
          />
          <input
            {...register("gateNumberId")}
            placeholder="Gate Number"
            className="input"
          />

          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-6 gap-4">
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
