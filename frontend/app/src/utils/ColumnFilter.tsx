import { Column, FilterFn, Table } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils';

export type CustomColumnFiltersState = CustomColumnFilter[];
export interface CustomColumnFilter {
  id: string;
  dataType: unknown;
  value: unknown;
}

export const fuzzyFilter: FilterFn<any> = (
  row: any,
  columnId: any,
  value: any,
  addMeta: any
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  console.log(itemRank.passed);
  return itemRank.passed;
};

// A debounced input react component
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      //   className='m-0'
      //   style={{ width: '100%' }}
    />
  );
};

export const ColumnFilter = ({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  useEffect(() => {
    console.log({ type: typeof firstValue, firstValue: firstValue });
  }, []);

  return typeof firstValue === 'number' ? (
    <div>
      <div className='flex space-x-2'>
        <DebouncedInput
          type='number'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className='w-24 border shadow rounded'
        />
        <DebouncedInput
          type='number'
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className='w-24 border shadow rounded'
        />
      </div>
      <div className='h-1' />
    </div>
  ) : (
    <>
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type='text'
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => {
          // console.log(value);
          column.setFilterValue(value);
          // column.setFilterValue({
          //   dataType: typeof firstValue,
          //   wildcard: value,
          // });
        }}
        // placeholder={`Buscar... (${column.getFacetedUniqueValues().size})`}
        placeholder={`Filtrar...`}
        className='w-36 border shadow rounded'
        list={column.id + 'list'}
      />
      <div className='h-1' />
    </>
  );
};
