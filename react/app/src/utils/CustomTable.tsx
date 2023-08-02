import { Table as RTable, flexRender } from '@tanstack/react-table';
import { styled } from '@mui/material/styles';
import {
  KeyboardDoubleArrowLeft as KeyboardDoubleArrowLeftIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardDoubleArrowRight as KeyboardDoubleArrowRightIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Expand as ExpandIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import {
  Button,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface ICustomTableProps {
  table: RTable<any>;
}

export const CustomTable = (props: ICustomTableProps) => {
  const { table } = props;
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <StyledTableCell key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className=''>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none d-flex mb-1'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}{' '}
                          {header.column.getCanSort() &&
                            !header.column.getIsSorted() && <ExpandIcon />}
                          {{
                            asc: <ExpandLessIcon />,
                            desc: <ExpandMoreIcon />,
                          }[header.column.getIsSorted() as string] ?? null}
                          {/* <div></div> */}
                        </div>
                        {/* {header.column.getCanFilter() ? (
                        <ColumnFilter
                          column={header.column}
                          table={table}
                        />
                      ) : null} */}
                      </div>
                    )}
                  </StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <StyledTableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <StyledTableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className='d-flex justify-content-between align-items-center m-2'>
        <p>
          Página &nbsp;
          <strong>
            {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </strong>
        </p>

        <Stack direction='row' spacing='2'>
          <Button
            variant='contained'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <KeyboardDoubleArrowLeftIcon />
          </Button>
          <Button
            variant='contained'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <KeyboardArrowLeftIcon />
          </Button>
          <Button
            variant='contained'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <KeyboardArrowRightIcon />
          </Button>
          <Button
            variant='contained'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <KeyboardDoubleArrowRightIcon />
          </Button>
        </Stack>

        <Select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          size='small'
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <MenuItem key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </MenuItem>
          ))}
        </Select>
      </div>
    </>
  );
};
