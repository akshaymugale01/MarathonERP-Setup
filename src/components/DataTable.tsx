// components/DataTable.tsx
// import { useState, useMemo } from "react";
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
        "rounded shadow-md border border-gray-400 bg-white p-4",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search by..."
          className="border px-3 py-1 rounded-md border-red-700 w-80"
          value={search}
          onChange={(e) => {
            const searchValue = e.target.value;
            onSearchChange?.(searchValue);
          }}
        />
        <select
          value={perPage}
          onChange={(e) => {
            onPerPageChange?.(parseInt(e.target.value, 10));
          }}
          className="border px-3 py-1 rounded-md"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              Show {num}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full table-auto text-sm border border-gray-200">
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
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
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
                  "px-3 py-1 border rounded ",
                  page === i + 1 ? "bg-maroon text-white" : "bg-white"
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
        <div className="text-sm text-gray-500">
          Showing {((page ?? 1) - 1) * (perPage ?? 10) + 1} to{" "}
          {Math.min((page ?? 1) * (perPage ?? 10), currentTotal)} of{" "}
          {totalCount} entries
        </div>
      </div>
    </div>
  );
}
