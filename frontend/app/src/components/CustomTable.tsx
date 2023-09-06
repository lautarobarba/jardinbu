
import { Pagination, Select, SelectItem } from '@nextui-org/react';
import { Table as RTable, flexRender } from '@tanstack/react-table';
import { ArrowDownAZIcon, ArrowUpAZIcon, ArrowUpDownIcon } from 'lucide-react';

interface ICustomTableProps {
  table: RTable<any>;
}

export const CustomTable = (props: ICustomTableProps) => {
  const { table } = props;

  const handlePageChange = (page: number) => {
    table.setPageIndex(page - 1);
  }

  const handlePaginationSizeChange = (event: any) => {
    table.setPageSize(Number(event.target.value));
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-dark dark:text-light">
          <thead className="text-xs text-white uppercase bg-navbar-bg">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} scope="col" className="px-6 py-3">
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex flex-row items-center space-x-2'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <span>
                          {
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}{' '}
                        </span>
                        <span>
                          {header.column.getCanSort() &&
                            !header.column.getIsSorted() && <ArrowUpDownIcon />}
                          {{
                            asc: <ArrowUpAZIcon />,
                            desc: <ArrowDownAZIcon />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col md:flex-row justify-center items-center md:justify-between align-center m-2 space-y-2'>
        <div>
          <p className="text-dark dark:text-light">
            Página &nbsp;
            <strong>
              {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </strong>
          </p>
        </div>

        <div>
          <Pagination
            isCompact
            showControls
            total={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={handlePageChange}
            color={"primary"}
            classNames={{
              wrapper: "shadow-md",
              prev: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              next: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
              item: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            }}
          />
        </div>

        <div className='min-w-unit-6'>
          <select
            id="pageSize"
            className="bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white text-md rounded-lg block w-full p-1 h-9"
            onChange={handlePaginationSizeChange}
            value={table.getState().pagination.pageSize}
          >
            <option value="5">5&nbsp;&nbsp;&nbsp;Resultados</option>
            <option value="10">10&nbsp;&nbsp;Resultados</option>
            <option value="25">25&nbsp;&nbsp;Resultados</option>
            <option value="50">50&nbsp;&nbsp;Resultados</option>
            <option value="100">100&nbsp;Resultados</option>
          </select>
        </div>
      </div>
    </>
  );
};
