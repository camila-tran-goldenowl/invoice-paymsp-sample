/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { CSVLink } from "react-csv";
import { useDarkmode } from "hooks/useDarkmode";
import { useMemo, useEffect, useState, ReactNode, useRef, HTMLProps } from "react";
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce, useSortBy } from "react-table";

// core components
import Icon from "@mui/material/Icon";
import Table from "@mui/material/Table";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Autocomplete from "@mui/material/Autocomplete";
import TableContainer from "@mui/material/TableContainer";

// components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDSelect from "components/MDSelect";
import MDTypography from "components/MDTypography";
import MDPagination from "components/MDPagination";

import DataTableHeadCell from "../Cell/DataTableHeadCell";
import DataTableBodyCell from "../Cell/DataTableBodyCell";

// types
import { IPaginationResponse, defaultPaginationResponse } from "types/InterfaceApi";

// data
import { PAGE_SIZE_DEFAULT, NUMBER_PAGE_SHOW, ENTRIES_PER_PAGE_DEFAULT } from "utils/constants";

// Declaring props types for DataTable
interface Props {
  entriesPerPage?: {
    defaultValue: number;
    entries: number[];
  };
  showTotalEntries?: boolean;
  table: {
    columns: { [key: string]: any }[];
    rows: { [key: string]: any }[];
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

function DataTable({
  entriesPerPage,
  showTotalEntries,
  table,
  paginationStyles,
  isSorted,
  noEndBorder,
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
}: Props): JSX.Element {
  const darkMode = useDarkmode();
  let defaultValue: number = entriesPerPage?.defaultValue ?? ENTRIES_PER_PAGE_DEFAULT[0];
  let entries: number[] = entriesPerPage?.entries ?? ENTRIES_PER_PAGE_DEFAULT;
  const [selectedList, setSelectedList] = useState<readonly string[]>([]);

  const columns = useMemo<any>(() => {
    const tableColumns = [...table.columns];
    if (selected?.isShow)
      tableColumns.unshift({
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      });
    return tableColumns;
  }, [table]);
  const data = useMemo<any>(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    page,
    setPageSize,
    state: { pageSize },
  }: any = tableInstance;
  let pageIndex = Number(paginationData.current);
  let [pageOptions, setPageOptions] = useState([]);

  // Set the default value for the entries per page when component mounts
  useEffect(() => setPageSize(defaultValue), [defaultValue, setPageSize]);

  useEffect(() => {
    let result = [];
    for (let i = 0; i < paginationData.total_pages; i++) {
      result.push(i + 1);
    }
    setPageOptions(result);
  }, [paginationData.total_pages]);

  const canPreviousPage = pageIndex !== 1;
  const canNextPage = pageIndex !== pageOptions.length;

  // Set the entries per page value based on the select value
  const setEntriesPerPage = (value: any) => setPageSize(value);

  // Render the paginations
  const renderPagination = () => {
    let clonePageOption = [...pageOptions];
    if (clonePageOption.length > NUMBER_PAGE_SHOW) {
      let index = pageIndex - 1;
      if (index - 2 >= 0 && index - 2 + NUMBER_PAGE_SHOW <= pageOptions.length) {
        clonePageOption = clonePageOption.slice(index - 2, index - 2 + NUMBER_PAGE_SHOW);
      } else if (index - 2 < 0) {
        clonePageOption = clonePageOption.slice(0, NUMBER_PAGE_SHOW);
      } else if (index + 3 >= pageOptions.length) {
        clonePageOption = clonePageOption.slice(
          pageOptions.length - NUMBER_PAGE_SHOW,
          pageOptions.length
        );
      }
    }

    return clonePageOption.map((option: any) => {
      return (
        <MDPagination
          item
          key={option}
          onClick={() => {
            pageIndex = option;
            gotoPage?.(Number(option));
          }}
          active={pageIndex === option}
        >
          {option}
        </MDPagination>
      );
    });
  };

  const nextPage = () => {
    gotoPage && gotoPage(Number(pageIndex + 1));
  };

  const previousPage = () => {
    gotoPage && gotoPage(Number(pageIndex - 1));
  };
  // // Search input value state
  const [searchText, setSearchText] = useState<string>("");

  // Search input state handle
  const onSearchChange = useAsyncDebounce(value => {
    search.handleChange(value);
  }, 1000);

  // A function that sets the sorted value for the table
  const setSortedValue = (column: any) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  // Setting the entries starting point
  const entriesStart = pageIndex === 1 ? 1 : pageSize * (pageIndex - 1) + 1;

  // Setting the entries ending point
  const entriesEnd = pageSize * pageIndex;

  const handleClickRow = (row: any) => {
    const rowData = row.original;
    handleClick(rowData);
  };

  const [headers, setHeaders] = useState([]);
  useEffect(() => {
    if (csvReport.isShow) {
      const cloneColumns = columns.map((item: { accessor: string; Header: string }) => {
        return { ...item, key: item.accessor, label: item.Header };
      });
      setHeaders(cloneColumns);
    }
  }, []);

  const handleFilter = useAsyncDebounce(value => {
    filter.handleChange(value);
  }, 1000);

  // SELECTED
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    let listId = [];
    if (event.target.checked) {
      listId = data.map(item => item[selected.field]);
      setSelectedList(listId);
    } else setSelectedList([]);
    selected?.handleSelected && selected.handleSelected(listId);
  };

  const isSelected = row => {
    const rowData = row.original;
    return selectedList.indexOf(rowData[selected.field]) !== -1;
  };

  const handleCheckbox = row => {
    const rowData = row.original;
    const key = rowData[selected.field];
    const selectedIndex = selectedList.indexOf(key);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedList, key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedList.slice(1));
    } else if (selectedIndex === selectedList.length - 1) {
      newSelected = newSelected.concat(selectedList.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedList.slice(0, selectedIndex),
        selectedList.slice(selectedIndex + 1)
      );
    }

    setSelectedList(newSelected);
    selected?.handleSelected && selected.handleSelected(newSelected);
  };

  useEffect(() => {
    if (selected.isClearSelected) setSelectedList([]);
  }, [selected.isClearSelected]);

  return (
    <TableContainer sx={{ boxShadow: "none" }}>
      {title && <MDTypography p={3}>{title}</MDTypography>}
      <MDBox sx={{ position: "relative" }}>
        {entriesPerPage || search.isShow ? (
          <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
            {entriesPerPage && (
              <MDBox display="flex" alignItems="center">
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    setEntriesPerPage(parseInt(newValue, 10));
                    handleSelectPageSize(newValue);
                  }}
                  size="small"
                  sx={{ width: "5rem" }}
                  renderInput={params => <MDInput {...params} />}
                />
                <MDTypography variant="caption" color="secondary">
                  &nbsp;&nbsp;entries per page
                </MDTypography>
                {childrenLeft}
              </MDBox>
            )}
            {children}
            <MDBox display="flex" alignItems="center">
              {search.isShow && (
                <MDBox width="12rem" pl={3}>
                  <MDInput
                    placeholder="Search..."
                    value={searchText}
                    size="small"
                    fullWidth
                    onChange={({ currentTarget }: any) => {
                      setSearchText(currentTarget.value);
                      onSearchChange(currentTarget.value);
                    }}
                  />
                </MDBox>
              )}
              {filter.isShow && (
                <MDBox ml={1}>
                  <MDSelect
                    isMultiple={filter.isMultiple}
                    data={filter.data}
                    label={filter.label}
                    defaultValue={filter?.defaultValue ?? []}
                    handleChange={handleFilter}
                  />
                </MDBox>
              )}
              {csvReport.isShow && (
                <MDBox ml={1}>
                  {csvReport.handleGetFile ? (
                    <MDButton
                      color={darkMode ? "white" : "info"}
                      variant="outlined"
                      size="small"
                      p={3}
                      onClick={csvReport.handleGetFile}
                    >
                      Export CSV
                    </MDButton>
                  ) : (
                    <CSVLink filename={`${csvReport.fileName}.csv`} data={data} headers={headers}>
                      <MDButton color="info" variant="outlined" size="small" p={3}>
                        Export CSV
                      </MDButton>
                    </CSVLink>
                  )}
                </MDBox>
              )}
            </MDBox>
          </MDBox>
        ) : null}

        <Table {...getTableProps()}>
          <MDBox component="thead">
            {headerGroups.map((headerGroup: any) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any, index) => (
                  <DataTableHeadCell
                    {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                    width={column.width ? column.width : "auto"}
                    align={column.align ? column.align : "left"}
                    sorted={setSortedValue(column)}
                    styles={styles?.header ?? {}}
                  >
                    {selected?.isShow && index === 0 && (
                      <Checkbox
                        color="primary"
                        checked={selectedList.length === data.length && data.length}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                          handleSelectAllClick(event)
                        }
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    )}
                    {column.render("Header")}
                  </DataTableHeadCell>
                ))}
              </TableRow>
            ))}
          </MDBox>
          <TableBody {...getTableBodyProps()}>
            {page.map((row: any, key: any) => {
              prepareRow(row);
              return (
                <TableRow
                  {...row.getRowProps()}
                  hover
                  onClick={() => handleClick && handleClickRow(row)}
                >
                  {row.cells.map((cell: any, index) => {
                    let isItemSelected = false;
                    if (selected?.isShow) isItemSelected = isSelected(row);

                    return (
                      <DataTableBodyCell
                        noBorder={noEndBorder && rows.length - 1 === key}
                        align={cell.column.align ? cell.column.align : "left"}
                        {...cell.getCellProps()}
                        handleClick={() => handleClickCell?.(cell)}
                        styles={styles?.row ?? {}}
                      >
                        {selected?.isShow && index === 0 && (
                          <Checkbox
                            color="primary"
                            onClick={() => handleCheckbox(row)}
                            checked={Boolean(isItemSelected)}
                          />
                        )}
                        {cell.render("Cell")}
                      </DataTableBodyCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {!page.length && (
          <MDTypography variant="body2" sx={{ textAlign: "center", mt: 2 }}>
            Data is empty
          </MDTypography>
        )}
      </MDBox>

      <MDBox
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        p={!showTotalEntries && pageOptions.length === 1 ? 0 : 3}
      >
        {showTotalEntries && (
          <MDBox mb={{ xs: 3, sm: 0 }}>
            <MDTypography variant="button" color="secondary" fontWeight="regular">
              Showing {entriesStart} to {entriesEnd} of {paginationData.total_count} entries
            </MDTypography>
          </MDBox>
        )}
        {pageOptions.length > 1 && (
          <MDPagination
            variant={paginationStyles?.variant ? paginationStyles.variant : "gradient"}
            color={paginationStyles?.color ? paginationStyles.color : "info"}
          >
            {canPreviousPage && (
              <MDPagination item onClick={() => previousPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>
            )}

            {renderPagination()}
            {canNextPage && (
              <MDPagination item onClick={() => nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            )}
          </MDPagination>
        )}
      </MDBox>
    </TableContainer>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return <input type="checkbox" ref={ref} className={className + " cursor-pointer"} {...rest} />;
}

// Declaring default props for DataTable
DataTable.defaultProps = {
  entriesPerPage: {
    defaultValue: PAGE_SIZE_DEFAULT,
    entries: ["5", "10", "15", "20", "25"],
  },
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  paginationData: defaultPaginationResponse,
  loading: false,
  csvReport: {
    isShow: false,
    fileName: "",
  },
  filter: {
    isShow: false,
    isMultiple: true,
  },
  search: {
    isShow: false,
  },
  selected: {
    isShow: false,
  },
};

export default DataTable;
