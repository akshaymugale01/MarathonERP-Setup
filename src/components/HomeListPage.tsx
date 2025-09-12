// components/DataTable.tsx
import { BiSearch } from "react-icons/bi";
import { cn } from "../lib/utils";
import clsx from "clsx";

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
};

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
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-[0_3px_8px_rgba(0,0,0,0.3)] p-5 mb-4",
        className
      )}
    >
      <div className="flex justify-end items-center mb-4 gap-4">
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
              position: "relative"
            }}
          >
            <table className="w-100 dataTable no-footer" style={{ width: "100%" }}>
              <thead 
                className="bg-maroon text-white"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: ""
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
                            textOverflow: "ellipsis"
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
                                backgroundColor: i % 2 === 0 ? "white" : "#f9f9f9",
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
                page === i + 1 && "bg-red-800 text-red-800 "
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
  );
}
