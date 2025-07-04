import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { BiCheckSquare, BiSquare } from "react-icons/bi";
import { toast } from "react-hot-toast";
import type { Country } from "../../../types/General/countries";
import {
  deleteCountryById,
  getCountry,
  updateStatusCountry,
  createCountry,
  updateCountry,
} from "../../../services/General/countryService";
import DataTable from "../../../components/DataTable";
import SelectBox from "../../../components/forms/SelectBox";
import GeneralMasterModal from "../../../components/forms/GeneralMasterModal";

export default function CountriesList() {
  const [countries, setCountres] = useState<Country[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [viewId, setViewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Country>();

  const loadData = useCallback(() => {
    getCountry({ page, per_page: perPage, search }).then((res) => {
      setCountres(res.countries);
      setTotalCount(res.total_count);
    });
  }, [page, perPage, search]);

  console.log("countries", countries);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggle = async (userId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    try {
      await updateStatusCountry(userId, { active: newStatus });

      setCountres((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, active: newStatus } : user
        )
      );

      toast.success(`Country ${newStatus ? "enabled" : "disabled"}`, {
        style: {
          backgroundColor: newStatus ? "#dcfce7" : "#fef2f2",
          color: newStatus ? "#16a34a" : "#991b1b",
          border: `1px solid ${newStatus ? "#16a34a" : "#991b1b"}`,
        },
      });
    } catch (error) {
      toast.error(`Failed to update country status: ${error}`);
    }
  };

  const regionOptions = [
    { value: "americas", label: "Americas" },
    { value: "asia_pacific", label: "Asia Pacific" },
    { value: "europe", label: "Europe" },
    { value: "middle_east", label: "Middle East" },
    { value: "africa", label: "Africa" },
  ];

  const handelDelete = async (id: number) => {
    if (!window.confirm("Want to delete country?")) return;
    try {
      await deleteCountryById(id);
      toast.success("Deleted successfully");
      loadData();
    } catch {
      toast.error("Failed To Delete");
    }
  };

  const handleCreate = () => {
    setEditingCountry(null);
    reset({
      country: "",
      country_code: "",
      isd_code: "",
      region: "",
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    reset({
      country: country.country,
      country_code: country.country_code,
      isd_code: country.isd_code,
      region: country.region,
      active: country.active,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Country) => {
    try {
      if (editingCountry?.id) {
        // Update existing country
        await updateCountry(editingCountry.id, data);
        toast.success("Country updated successfully");
      } else {
        // Create new country
        await createCountry(data);
        toast.success("Country created successfully");
      }
      setIsModalOpen(false);
      setEditingCountry(null);
      reset();
      loadData();
    } catch (error) {
      toast.error("Operation failed");
      console.error("Error:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCountry(null);
    reset();
  };

  const columns: {
    header: string;
    accessor: keyof Country;
    render?: (user: Country, index: number) => React.ReactNode;
  }[] = [
    {
      header: "Sr No.",
      accessor: "id",
      render: (_country, index) => (page - 1) * perPage + index + 1,
    },
    { header: "Country Code", accessor: "country_code" },
    { header: "Region", accessor: "region" },
    { header: "Country Name", accessor: "country" },
    { header: "ISD Code", accessor: "isd_code" },

    {
      header: "Actions",
      accessor: "id",
      render: (country) => (
        <div className="flex justify-center p-2 border rounded gap-2">
          <button
            onClick={() => handleEdit(country)}
            className="cursor-pointer underline"
            title="Edit"
          >
            <MdEdit size={18} />
          </button>
          <button
            onClick={() => setViewId(country.id)}
            className="cursor-pointer underline"
            title="View"
          >
            <IoMdEye size={18} />
          </button>
          <button
            onClick={() => handleToggle(country.id, country.active)}
            className="cursor-pointer underline"
            title={country.active ? "Disable" : "Enable"}
          >
            {country.active ? (
              <BiCheckSquare size={24} className="text-green-600" />
            ) : (
              <BiSquare size={24} className="text-gray-400" />
            )}
          </button>
          <button
            onClick={() => handelDelete(country.id)}
            className="cursor-pointer underline"
            title="Delete"
          >
            <MdDelete size={17} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      <div className="border rounded-md p-6 bg-white border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Country</h2>
        </div>
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={handleCreate}
            className="bg-red-800 text-white px-4 py-2 rounded-md"
          >
            + Create Country
          </button>
        </div>
        <div className="overflow-x-auto w-full max-h-[80vh]">
          <DataTable<Country>
            data={countries}
            columns={columns}
            perPage={perPage}
            totalCount={totalCount}
            page={page}
            search={search}
            onPageChange={(p) => setPage(p)}
            onPerPageChange={(count) => {
              setPerPage(count);
              setPage(1);
            }}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <GeneralMasterModal
          title={editingCountry ? "Edit Country" : "Create Country"}
          onClose={handleModalClose}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* First Row - Country Code and Country Name */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Country Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("country_code", {
                    required: "Country code is required",
                    pattern: {
                      value: /^[A-Z]{2,5}$/,
                      message: "Country code should be 2-5 uppercase letters",
                    },
                  })}
                  className={`border p-3 rounded w-full uppercase ${
                    errors.country_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., IN, US, UK"
                />
                {errors.country_code && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.country_code.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">
                  Country Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("country", {
                    required: "Country name is required",
                    minLength: {
                      value: 2,
                      message: "Minimum 2 characters required",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter country name"
                />
                {errors.country && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.country.message}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row - Region and ISD Code */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">
                  Region <span className="text-red-500">*</span>
                </label>
                <SelectBox
                  name="region"
                  control={control}
                  options={regionOptions}
                  placeholder="Select Region"
                />
                {errors.region && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.region.message}
                  </span>
                )}
              </div>
              <div>
                <label className="block mb-2 font-medium">ISD Code</label>
                <input
                  type="text"
                  {...register("isd_code", {
                    pattern: {
                      value: /^\+\d{1,4}$/,
                      message:
                        "ISD code should start with + followed by digits",
                    },
                  })}
                  className={`border p-3 rounded w-full ${
                    errors.isd_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., +91, +1, +44"
                />
                {errors.isd_code && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.isd_code.message}
                  </span>
                )}
              </div>
            </div>

            {/* Third Row - Active Status */}
            {/* <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                {...register("active")}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="active" className="font-medium text-gray-700">
                Active
              </label>
            </div> */}

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4 border-t border-gray-200 mt-6">
              <button
                type="submit"
                className="bg-red-800 text-white px-6 w-40 py-2.5 rounded hover:bg-red-900 transition-colors font-medium"
              >
                {editingCountry ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="border border-gray-400 px-6 w-40 py-2.5 rounded hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </GeneralMasterModal>
      )}

      {/* View Modal */}
      {viewId && (
        <GeneralMasterModal
          title="Country Details"
          onClose={() => setViewId(null)}
        >
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Country Code</span>
            <span>
              {countries.find((nt) => nt.id === viewId)?.country_code}
            </span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Region</span>
            <span>{countries.find((nt) => nt.id === viewId)?.region}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Country Name</span>
            <span>{countries.find((nt) => nt.id === viewId)?.country}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">ISD Code</span>
            <span>{countries.find((nt) => nt.id === viewId)?.isd_code}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-semibold">Status</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                countries.find((nt) => nt.id === viewId)?.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {countries.find((nt) => nt.id === viewId)?.active
                ? "Active"
                : "Inactive"}
            </span>
          </div>
          <div className="flex justify-end py-2">
            <button
              className="border border-red-800 text-red-800 px-4 py-2 rounded hover:bg-red-50"
              onClick={() => setViewId(null)}
            >
              Close
            </button>
          </div>
        </GeneralMasterModal>
      )}
    </div>
  );
}
