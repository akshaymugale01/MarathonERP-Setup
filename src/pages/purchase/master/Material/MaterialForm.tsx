// components/MaterialForm.tsx

import { useEffect, useState } from "react";
import SelectBox from "../../../../components/forms/SelectBox";
import { getPurchaseDropdown } from "../../../../services/purchaseDropDownServices";
import type { Material } from "../../../../types/Admin/material";
import { useForm } from "react-hook-form";
import { mapToOptions } from "../../../../utils";
import useImageUpload from "../../../../components/forms/HandleImage";
import { createMaterial } from "../../../../services/Purchase/materialsService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { watch } from "fs";
// import { number } from "framer-motion";

type MaterialFormProps = {
  onClose: () => void;
  mode: "create" | "edit" | "details";
  isDisabled?: boolean;
};
export default function MaterialForm({ onClose }: MaterialFormProps) {
  const [purchaseDrop, setPurchaseDrop] = useState({
    inventory_types: [],
    hsn_codes: [],
  });

  const { control, register, handleSubmit, watch } = useForm<Material>();

  useEffect(() => {
    const subscription = watch((data) => {
      console.log("Live Values", data);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const navigate = useNavigate();

  const { images, handleImageUpload } = useImageUpload();
  console.log("image", images);

  console.log("dropdwon", purchaseDrop?.hsn_codes);

  useEffect(() => {
    getPurchaseDropdown().then((res) => {
      console.log("API Response", res);
      setPurchaseDrop(res);
    });
  }, []);

  const materialTypeOptions = mapToOptions(purchaseDrop?.inventory_types);
  const materialOptions = [
    { value: "material", label: "Material" },
    { value: "asset", label: "Asset" },
  ];

  const mtcRequired = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const perishableOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const periShablePeriodOpts = [
    { value: "hours", label: "Hours" },
    { value: "days", label: "Days" },
    { value: "weeks", label: "Week" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
  ];

  const qcOPtions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const hsnCode: { id: number | string; hsn_code: string }[] =
    purchaseDrop?.hsn_codes || [];
  const hsnCodeOptions = hsnCode.map((t) => ({
    value: t.hsn_code,
    label: t.hsn_code,
  }));

  const onSubmit = async (data: Material) => {
    try {
      await createMaterial(data);
      
      toast.success("Material created successfully!");
      navigate("/purchase/material");
    } catch (error) {
      toast.error("Error saving user.");
      console.error(error);
    }
  };

  // console.log("HSN Drop", hsnCodeOptions);

  return (
    <form className="grid grid-cols-4 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col col-span-1">
        <label>
          Material Category <span className="text-red-800">*</span>
        </label>
        <SelectBox
          name="material_category"
          control={control}
          options={materialOptions}
          placeholder="Select Material"
        />
      </div>
      <div className="flex flex-col col-span-1">
        <label>
          Material Type <span className="text-red-700">*</span>
        </label>
        <SelectBox
          name="inventory_type_id"
          control={control}
          options={materialTypeOptions}
          placeholder="Select Material Type"
          //   isDisabled={isDetails}
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>
          Material Name <span className="text-red-700">*</span>
        </label>
        <input
          {...register("name", { required: true })}
          // type="textarea"
          className="border rounded p-2"
          placeholder="Enter Material Name"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Material Code</label>
        <input
          {...register("material_code")}
          className="border bg-gray-200 rounded p-2"
          placeholder="Material Code"
          disabled
          // name="material_code"
        />
      </div>
      <div className="flex flex-col col-span-1">
        <label>Lead time *</label>
        <input
          {...register("lead_time")}
          className="border rounded p-2"
          placeholder="Enter Lead Time In Days"
          // name="lead_time"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Urgent lead time *</label>
        <input
          {...register("urgent_lead_time")}
          name="urgent_lead_time"
          className="border rounded p-2"
          placeholder="Enter Urgent Lead Time In Days"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Very Urgent Lead Time *</label>
        <input
          {...register("benchmark_lead_time")}
          name="benchmark_lead_time"
          className="border rounded p-2"
          placeholder="Enter Very Urgent Lead Time In Days"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Image of the material</label>
        <input
          {...register("attachments")}
          type="file"
          className="border rounded p-2"
          multiple
          onChange={(e) => handleImageUpload(e, "attachments")}
        />
        {images.attachments && images.attachments.length > 0 && (
          <div className="text-xs mt-1 flex flex-col gap-1">
            {images.attachments.map((file, idx) => (
              <span
                className="p-1 border border-black border-t-0 border-r-0 border-l-0"
                key={idx}
              >
                {file.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col col-span-1">
        <label>Manufacture Tolerance Allowed</label>
        <input
          {...register("manufacture_tolerance")}
          className="border rounded p-2"
          name="manufacture_tolerance"
          placeholder="Enter in %"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Breakage Tolerance Allowed</label>
        <input
          {...register("breakage_tolerance")}
          className="border rounded p-2"
          name="breakage_tolerance"
          placeholder="Enter in %"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Wastage Tolerance Allowed</label>
        <input
          {...register("wastage_tolerance")}
          className="border rounded p-2"
          name="wastage_tolerance"
          placeholder="Enter in %"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>HSN Code *</label>
        <SelectBox
          name="hsn_code"
          control={control}
          placeholder="Select Code"
          options={hsnCodeOptions}
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>MTC Required</label>
        <SelectBox
          name="mtc_required"
          control={control}
          placeholder="Select MTC"
          options={mtcRequired}
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Perishable</label>
        <SelectBox
          name="perishable"
          control={control}
          placeholder="Select Perishable"
          options={perishableOptions}
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label className="font-bold mb-1">Perishable Period</label>
        <div className="flex w-full">
          <div className="w-1/2">
            <SelectBox
              name="perishable_time_type"
              options={periShablePeriodOpts}
              placeholder="Select Period"
              control={control}
            />
          </div>
          <input
            {...register("perishable_time")}
            className="border rounded p-2 w-1/2"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
      </div>
      <div className="flex flex-col col-span-1">
        <label className="font-bold mb-1">Typical Warranty Period</label>
        <div className="flex w-full">
          <div className="w-1/2">
            <SelectBox
              name="typical_warranty_time_type"
              options={periShablePeriodOpts}
              placeholder="Select Period"
              control={control}
            />
          </div>
          <input
            {...register("typical_warranty_time")}
            className="border rounded p-2 w-1/2"
            type="number"
            min={0}
            defaultValue={0}
          />
        </div>
      </div>

      <div className="flex flex-col col-span-1">
        <label>Warranty Remarks</label>
        <textarea
          {...register("warranty_remarks")}
          // name="warranty_remarks"
          className="border rounded p-2"
          placeholder="Enter warranty Remarks"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>Remarks</label>
        <textarea
          {...register("remark")}
          // name="remark"
          className="border rounded p-2"
          placeholder="Enter Remarks"
        />
      </div>

      <div className="flex flex-col col-span-1">
        <label>QC Applicable</label>
        <SelectBox
          name="is_qc"
          control={control}
          options={qcOPtions}
          placeholder="QC Applicable"
        />
      </div>

      <div className="flex items-center gap-4 col-span-1">
        <div className="flex items-center gap-6 mt-2">
          <label className="flex items-center gap-1" htmlFor="wbs-true">
            <input
              type="radio"
              {...register("wbs_tag")}
              value="true"
              id="wbs-true"
            />
            <span>WBS</span>
          </label>
          <label className="flex items-center gap-1" htmlFor="wbs-false">
            <input
              type="radio"
              {...register("wbs_tag")}
              value="false"
              id="wbs-false"
            />
            <span>Non-WBS</span>
          </label>
        </div>
      </div>

      <div className="col-span-4">
        <h3 className="font-bold mt-4">Terms and conditions</h3>
        <div className="border mt-2">
          <div className="bg-red-800 text-white p-2 grid grid-cols-4 font-semibold">
            <div>Condition Category</div>
            <div>Condition</div>
            <div>Condition Remarks</div>
            <div>Action</div>
          </div>
          {/* Add your dynamic rows here */}
        </div>
      </div>

      <div className="flex justify-end gap-4 col-span-4 mt-4">
        <button
          type="submit"
          className="bg-red-800 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
