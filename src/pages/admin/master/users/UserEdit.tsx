import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../../types/user";
import { toast } from "react-toast";
import { createUser } from "../../../../services/userService";
import { getDropdownData } from "../../../../services/userDropDownService";
import { useForm } from "react-hook-form";

export default function UserEdit() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState({
    companies: [],
    branches: [],
    departments: [],
    designations: [],
    roles: [],
    managers: [],
  });

  console.log("dropdown", dropdowns);

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
