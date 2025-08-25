import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SelectBox from "../../../../components/forms/SelectBox";

interface BasicDetailsFormData {
  selectRFQ: string;
  selectSL: string;
  project: string;
  subProject: string;
  woCurrencyType: string;
  workOrderType: string;
  workCategory: string;
  workSubCategory: string;
  contractorName: string;
  grtinNo: string;
  panNo: string;
  contactPerson: string;
  remarks: string;
  scopeOfWork: string;
  estimatedCost: string;
  location: string;
  sizeArea: string;
  typeOfContract: string;
  securedAdvance: string;
  pfEsicWcp: string;
}

export default function BasicDetails() {
  const { register, handleSubmit, control } = useForm<BasicDetailsFormData>();
    

  const onSubmit = (data: BasicDetailsFormData) => {
    console.log("Basic Details:", data);
  };

  const workOrdeTypeOptions = [
    { value: "new", label: "New" },
    { value: "variation", label: "Variation" },
    { value: "amendment", label: "Amendment" },
    { value: "variation and amendment", label: "Variation And Amendment" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* First Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select RFQ No.
          </label>
          <select
            {...register("selectRFQ")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select RFQ</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount Type
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Not Applicable</option>
          </select>
        </div>

        {/* Second Row */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select S.I. No.
          </label>
          <select
            {...register("selectSL")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select S.I.</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobilization Advance Percentage
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <input
            {...register("project")}
            type="text"
            value="Navzone - Phase II"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobilization Advance Amount
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Project
          </label>
          <input
            {...register("subProject")}
            type="text"
            value="Aster"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>
        {/* Third Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobilization Guarantee Expiry Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            WO Currency Type
          </label>
          <select
            {...register("woCurrencyType")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Domestic">Domestic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Performance Guarantee Expiry Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Order Type
          </label>
          <SelectBox
            name="workOrderType"
            control={control}
            options={workOrdeTypeOptions}
            placeholder="Select Type of WO"
            // isDisabled={isDetails}
          />
        </div>

        {/* Fourth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EMD / BG Amount
          </label>
          <input
            type="text"
            value="INR"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Category*
          </label>
          <select
            {...register("workCategory")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Multiple Selection">[Multiple Selection]</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From (Tentative)*
          </label>
          <input
            type="date"
            defaultValue="2020-09-15"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Sub Category
          </label>
          <select
            {...register("workSubCategory")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="Select One">[Select One]</option>
          </select>
        </div>

        {/* Fifth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To (Tentative)*
          </label>
          <input
            type="date"
            defaultValue="2030-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contractor Name*
          </label>
          <input
            {...register("contractorName")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button className="text-red-600 text-sm mt-1">
            Select New Contact
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Order Printing Date
          </label>
          <input
            type="date"
            defaultValue="2030-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GRTIN No
          </label>
          <input
            {...register("grtinNo")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Sixth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Order Payment Term
          </label>
          <input
            type="date"
            defaultValue="2030-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN No
          </label>
          <input
            {...register("panNo")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Condition of contract
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Select</option>
          </select>
          <button className="text-red-600 text-sm mt-1">Select</button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Person
          </label>
          <input
            {...register("contactPerson")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Seventh Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Work Description*
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks
          </label>
          <textarea
            {...register("remarks")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time of Completion*
          </label>
          <input
            type="date"
            defaultValue="2030-12-31"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scope of Work*
          </label>
          <textarea
            {...register("scopeOfWork")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
          />
          <button className="text-red-600 text-sm mt-1">
            Add Scope of work
          </button>
        </div>

        {/* Eighth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            EMD / BG Amount
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Cost
          </label>
          <input
            {...register("estimatedCost")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Terms of Payments*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location*
          </label>
          <input
            {...register("location")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Ninth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Defect Liability Period (DLP)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size/Area*
          </label>
          <input
            {...register("sizeArea")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Liquidity Damage (LD)*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type of Contract *
          </label>
          <input
            {...register("typeOfContract")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Tenth Row */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobilization Advance*
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="">Select</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Secured Advance*
          </label>
          <input
            {...register("securedAdvance")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Quotation Number*
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PF/ESI/WCP*
          </label>
          <input
            {...register("pfEsicWcp")}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
    </form>
  );
}
