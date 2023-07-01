import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, GridColumn } from "@glideapps/glide-data-grid";

// type GlideTableProps = {
//   getData: any;
//   columns: any;
//   numRows: any;
// };

export const GlideTable = () => {
  // const { getData, columns, numRows } = props;

  const columns: GridColumn[] = [
    { title: "First Name", width: 100 },
    { title: "Last Name", width: 100 },
  ];

  return (
    <>
      <p>Table</p>
      {/* <DataEditor getCellContent={getData} columns={columns} rows={numRows} /> */}
    </>
  );
};
