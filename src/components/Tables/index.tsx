import DynamicDataTable from "./DynamicTable";
import StaticDataTable from "./StaticTable";
import MDBox from "components/MDBox";

// types
import { IPaginationResponse } from "types/InterfaceApi";
import { ReactNode } from "react";

interface IDataTableProps {
  entriesPerPage?: {
    defaultValue: number;
    entries: number[];
  };
  canSearch?: boolean;
  showTotalEntries?: boolean;
  table: {
    columns: { [key: string]: any }[];
    rows: { [key: string]: any }[];
  };
  pagination?: {
    variant: "contained" | "gradient";
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  };

  paginationStyles?: {
    variant: "contained" | "gradient";
    color: "primary" | "secondary" | "info" | "success" | "warning" | "error" | "dark" | "light";
  };
  paginationData?: IPaginationResponse;
  isSorted?: boolean;
  noEndBorder?: boolean;
  handleClick?: (event) => void;
  handleClickCell?: (event) => void;
  gotoPage?: (page) => void;
  loading?: Boolean;
  handleSelectPageSize?: (entries) => void;
  csvReport?: {
    isShow: boolean;
    fileName: string;
    handleGetFile?: () => void;
  };
  filter?: {
    isShow: boolean;
    label: string;
    data: Array<{ value: string; text: string }>;
    handleChange: (value) => void;
    isMultiple?: boolean;
    defaultValue?: string;
  };
  search?: {
    isShow: boolean;
    handleChange: (value) => void;
  };
  title?: string;
  isCheckbox?: boolean;
  selected?: {
    isShow: boolean;
    field: string;
    handleSelected: (list) => void;
    isClearSelected: boolean;
  };
  styles?: {
    header?: {
      [key: string]: any;
    };
    row?: {
      [key: string]: any;
    };
  };
  children?: ReactNode;
  childrenLeft?: ReactNode;
}

const DataTable = ({
  canSearch,
  pagination,
  isSorted,
  noEndBorder,
  entriesPerPage,
  showTotalEntries,
  table,
  paginationStyles,
  handleClick,
  paginationData,
  gotoPage,
  loading,
  handleSelectPageSize,
  csvReport,
  title,
  filter,
  search,
  selected,
  handleClickCell,
  styles,
  children,
  childrenLeft,
}: IDataTableProps) => {
  return (
    <MDBox>
      {paginationData ? (
        <DynamicDataTable
          entriesPerPage={entriesPerPage}
          showTotalEntries={showTotalEntries}
          table={table}
          paginationStyles={paginationStyles}
          isSorted={isSorted}
          noEndBorder={noEndBorder}
          handleClick={handleClick}
          paginationData={paginationData}
          gotoPage={gotoPage}
          loading={loading}
          handleSelectPageSize={handleSelectPageSize}
          csvReport={csvReport}
          title={title}
          filter={filter}
          search={search}
          selected={selected}
          handleClickCell={handleClickCell}
          styles={styles}
          children={children}
          childrenLeft={childrenLeft}
        />
      ) : (
        <StaticDataTable
          entriesPerPage={entriesPerPage}
          canSearch={canSearch}
          table={table}
          pagination={pagination}
          isSorted={isSorted}
          noEndBorder={noEndBorder}
          selected={selected}
          showTotalEntries={showTotalEntries}
          handleClick={handleClick}
          styles={styles}
        />
      )}
    </MDBox>
  );
};

export default DataTable;
