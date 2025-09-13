// components/Enhanced HomeListPage
import { BiSearch } from "react-icons/bi";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import SelectBox from "./forms/SelectBox";

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
};

interface StatusCard {
  label: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

interface QuickFilter {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
}

interface BulkAction {
  label: string;
  options: { label: string; value: string }[];
  onAction?: (action: string, selectedIds: number[]) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  page?: number;
  perPage?: number;
  search: string;
  className?: string;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  onSearchChange?: (search: string) => void;
  searchKey?: keyof T;
  title?: string;
  actionSlot?: React.ReactNode;

  // Enhanced props
  statusCards?: StatusCard[];
  quickFilters?: QuickFilter[];
  bulkActions?: BulkAction;
  onQuickFilterApply?: (filters: Record<string, string>) => void;
}

export default function HomeDataTable<T extends object>({
  data,
  columns,
  page = 1,
  perPage = 10,
  search,
  className,
  totalCount = 0,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  actionSlot,
  statusCards,
  quickFilters,
  bulkActions,
  onQuickFilterApply,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  // Quick filter state with react-hook-form
  const { control, watch } = useForm<Record<string, string>>({
    defaultValues: {},
  });

  const [isQuickFilterOpen, setIsQuickFilterOpen] = useState(false);
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false);

  // Watch all form values for onChange handling
  const formValues = watch();

  // Handle filter onChange callbacks
  useEffect(() => {
    if (quickFilters) {
      quickFilters.forEach((filter) => {
        const currentValue = formValues[filter.value];
        if (currentValue && filter.onChange) {
          filter.onChange(currentValue);
        }
      });
    }
  }, [formValues, quickFilters]);

  const handleQuickFilterApply = () => {
    onQuickFilterApply?.(formValues);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="material-boxes mt-3 justify-content-between">
        <div className="container-fluid">
          <div className="row separteinto7 ">
            {/* Status Cards */}
            {statusCards && statusCards.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-6">
                {statusCards.map((card, index) => {
                  console.log(`Status card ${index}:`, {
                    label: card.label,
                    isActive: card.isActive,
                  });
                  return (
                    <button
                      key={index}
                      onClick={card.onClick}
                      style={
                        card.isActive
                          ? {
                              backgroundColor: "#991b1b",
                              color: "white",
                              borderColor: "#991b1b",
                              opacity: 1,
                            }
                          : {
                              backgroundColor: "white",
                              color: "#991b1b",
                              borderColor: "#991b1b",
                              opacity: 1,
                            }
                      }
                      className={cn(
                        "status-card-button col-md-2 px-6 py-4 rounded-lg border text-sm font-medium transition-colors text-center flex flex-col items-center justify-center",
                        "w-32 h-20 min-w-[128px] min-h-[80px] max-w-[128px] max-h-[80px]",
                        card.isActive ? "" : "hover:bg-red-50"
                      )}
                    >
                      <div
                        style={
                          card.isActive
                            ? { color: "white" }
                            : { color: "#991b1b" }
                        }
                        className="text-sm font-semibold leading-tight mb-1"
                      >
                        {card.label}
                      </div>
                      <div
                        style={
                          card.isActive
                            ? { color: "white" }
                            : { color: "#991b1b" }
                        }
                        className="text-xl font-bold leading-none"
                      >
                        {card.count}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-3 pb-4">
        <div className="card mx-3 mt-3 collapsed-card">
          {/* Quick Filter Card */}
          {quickFilters && quickFilters.length > 0 && (
            <div className="mx-3 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg">
              {/* Header */}
              <div className="card-header3">
                <h3 className="card-title">Quick Filter</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    onClick={() => setIsQuickFilterOpen(!isQuickFilterOpen)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-800 hover:bg-red-900 transition-colors"
                  >
                    <svg
                      className={`w-8 h-8 transition-transform duration-400 ${
                        isQuickFilterOpen ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="16"
                        fill="white"
                        opacity="0.1"
                      />
                      <path d="M16 20L10 12h12l-6 8z" fill="white" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Collapsible Body */}
              <div
                className={`transition-all  duration-300 overflow-hidden ${
                  isQuickFilterOpen
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-4 flex flex-wrap items-end gap-4">
                  {quickFilters.map((filter, index) => (
                    <div key={index} className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        {filter.label}
                        {filter.label.toLowerCase().includes("company") && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      <div className="min-w-[200px]">
                        <SelectBox
                          name={filter.value}
                          control={control}
                          options={filter.options.map((opt) => ({
                            value: opt.value,
                            label: opt.label,
                          }))}
                          placeholder={`Select ${filter.label}`}
                          required={false}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleQuickFilterApply}
                    className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors"
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Action Card */}
          {bulkActions && (
            <div className="mx-3 mt-3 bg-white shadow-lg border border-gray-200 rounded-lg">
              <div className="card-header3">
                <h3 className="card-title">Bulk Action</h3>
                <div className="card-tools">
                  <button
                    type="button"
                    onClick={() => setIsBulkActionOpen(!isBulkActionOpen)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-800 hover:bg-red-900 transition-colors"
                  >
                    <svg
                      className={`w-8 h-8 transition-transform duration-400 ${
                        isBulkActionOpen ? "rotate-180" : "rotate-0"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <circle
                        cx="16"
                        cy="16"
                        r="16"
                        fill="white"
                        opacity="0.1"
                      />
                      <path d="M16 20L10 12h12l-6 8z" fill="white" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Collapsible Body */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isBulkActionOpen
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  {/* From & To Status */}
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        From Status
                      </label>
                      <SelectBox
                        name="fromStatus"
                        control={control}
                        options={bulkActions.options.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        placeholder="Status"
                        required={false}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        To Status
                      </label>
                      <SelectBox
                        name="toStatus"
                        control={control}
                        options={bulkActions.options.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        placeholder="Status"
                        required={false}
                      />
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Comment
                    </label>
                    <textarea
                      placeholder="Enter ..."
                      className="form-control remark w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-red-800"
                      rows={6}
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex items-center justify-center">
                    <button className="px-6 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Action Section */}

        <div className="flex justify-end items-center mt-4 mb-4 gap-4">
          {/* Search Input + Icon Container */}
          <div className="flex items-center border border-red-800 rounded-full overflow-hidden">
            <input
              type="text"
              placeholder="Type your keywords here"
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="px-4 py-2 outline-none w-80 rounded-l-full text-sm"
            />
            <div className="flex items-center justify-center px-3 text-red-800 border-l border-red-800 bg-white">
              <BiSearch size={18} />
            </div>
          </div>

          {/* Create/Add Button */}
          {actionSlot && <div>{actionSlot}</div>}
        </div>

        <div
          className="tbl-container m-3 px-1 mt-3"
          style={{
            maxHeight: "400px",
            overflow: "hidden",
            border: "1px solid #dfdfdf",
          }}
        >
          <div className="dataTables_wrapper no-footer">
            <div
              className="table-scroll-container"
              style={{
                maxHeight: "400px",
                overflow: "auto",
                position: "relative",
              }}
            >
              <table
                className="w-100 dataTable no-footer"
                style={{ width: "100%" }}
              >
                <thead
                  className="bg-maroon text-white"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    backgroundColor: "",
                  }}
                >
                  <tr>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className="py-2 px-4 text-left text-white"
                        style={{
                          backgroundColor: "#b91c1c",
                          position: "sticky",
                          top: 0,
                          borderRight: "2px solid white",
                          minWidth: "66px",
                          maxWidth: "250px",
                          width: "auto",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.length > 0 ? (
                    data.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        {columns.map((col, j) => (
                          <td
                            key={j}
                            className="px-4 py-2 border-r border-gray-200"
                            title={String(row[col.accessor] ?? "")}
                            style={{
                              backgroundColor:
                                i % 2 === 0 ? "white" : "#f9f9f9",
                              borderRight: "1px solid #e5e7eb",
                              minWidth: "66px",
                              maxWidth: "250px",
                              width: "auto",
                              wordWrap: "break-word",
                              lineHeight: "1.4",
                            }}
                          >
                            {col.render
                              ? col.render(row, i + (page - 1) * perPage)
                              : String(row[col.accessor] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center py-4">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-3 pagination-section">
          {/* Left: Pagination numbers */}
          <div className="flex gap-1 mt-4">
            <button
              disabled={page === 1}
              onClick={() => onPageChange?.(page - 1)}
              className="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={clsx(
                  "px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-red-500",
                  page === i + 1 && "bg-red-800 text-red-800"
                )}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="px-3 py-1 border rounded bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* Right: Showing count + per page */}
          <div className="flex gap-3 mt-4 text-sm text-gray-600 items-center">
            <span>
              Showing {(page - 1) * perPage + 1} to{" "}
              {Math.min(page * perPage, totalCount)} of {totalCount} entries
            </span>
            <select
              value={perPage}
              onChange={(e) => onPerPageChange?.(parseInt(e.target.value))}
              className="border px-2 py-1 rounded text-sm text-gray-600"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  Show {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
