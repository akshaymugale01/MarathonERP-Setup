// components/DataTable.tsx
// import { useState, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { cn } from "../lib/utils";

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

export default function DataTable<T extends object>({
  data,
  columns,
  page,
  perPage,
  search,
  className,
  totalCount,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  title,
  actionSlot,
}: DataTableProps<T>) {
  // This for Client Side rendering
  // const [search, setSearch] = useState("");
  // const internalPage = page ?? 1;
  // const internalPerPage = perPage ?? 10;

  // const filteredData = useMemo(() => {
  //   if (!search) return data;
  //   return data.filter((row) =>
  //     String(row[search]).toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [search, data, page]);

  // const totalFiltered = totalCount ?? filteredData.length;
  // const totalPages = Math.ceil(totalFiltered / internalPerPage);

  // const paginatedData = filteredData.slice(
  //   (internalPage - 1) * internalPerPage,
  //   internalPage * internalPerPage
  // );

  // Global Define for Fallback page vlaues
  const currentPage = page ?? 1;
  const currentperPage = perPage ?? 1;
  const currentTotal = totalCount ?? 0;

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

      <div className="overflow-x-auto overflow-y-auto h-[500px]">
        <table className="min-w-full w-full table-auto text-sm border shadow-lg ">
          <thead className="bg-maroon text-white">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="py-2 px-4 text-left border-r bg-red-800 text-white border-white break-words max-w-[200px]"
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
                      className="px-4 py-2 break-words max-w-[200px]"
                      title={String(row[col.accessor] ?? "")} // optional
                    >
                      {col.render
                        ? col.render(
                            row,
                            i + (currentPage - 1) * currentperPage
                          )
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

      {/* <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {(internalPage - 1) * internalPerPage + 1} to{" "}
          {Math.min(internalPage * internalPerPage, totalFiltered)} of {totalFiltered} entries
        </div>
        <div className="flex gap-2">
          <button
            disabled={internalPage === 1}
            onClick={() => onPageChange?.(internalPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange?.(i + 1)}
              className={cn(
                "px-3 py-1 border rounded ",
                internalPage === i + 1 ? "bg-maroon text-white" : "bg-white"
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={internalPage === totalPages}
            onClick={() => onPageChange?.(internalPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div> */}

      {/* Pagination */}
      <div className="flex border-t-2 gap-2 items-center justify-between">
        <div className="flex mt-4 gap-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange?.((page ?? 1) - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(Math.ceil((totalCount ?? 0) / (perPage ?? 0)))].map(
            (_, i) => (
              <button
                key={i}
                onClick={() => onPageChange?.(i + 1)}
                className={cn(
                  "px-3 py-1 border rounded hover:bg-gray-100 focus:ring-2 focus:ring-red-500",
                  page === i + 1 ? "bg-maroon text-red-900" : "bg-white"
                )}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            disabled={page === Math.ceil((totalCount ?? 0) / (perPage ?? 0))}
            onClick={() => onPageChange?.((page ?? 0) + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="flex gap-2 mt-4 text-sm text-gray-500">
          <div className="flex">
            Showing {((page ?? 1) - 1) * (perPage ?? 10) + 1} to{" "}
            {Math.min((page ?? 1) * (perPage ?? 10), currentTotal)} of{" "}
            {totalCount} entries
          </div>
          <div>
            <select
              value={perPage}
              onChange={(e) => {
                onPerPageChange?.(parseInt(e.target.value, 10));
              }}
              className="border px-3 py-1 rounded text-sm text-gray-600"
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
