/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useQuery } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import Card from "@mui/material/Card";

// component
import MDBox from "components/MDBox";
import DataTable from "components/Tables";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "components/LayoutContainer/DashboardLayout";

// data
import { columnsDataTable } from "./data/columnsDataTable";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "utils/constants";

// type
import { PageSizeType } from "types/Table";

// store
import { useSlice as usePaymentSlice } from "./slice";
import { getCustomerId } from "utils/localStorageUtil";
import { useToastifySlice, IToastType } from "components/Toastify/slice";
import { selectPaymentList, selectPaymentPagination } from "./slice/selectors";

export function TransactionHistoryPage(): JSX.Element {
  const [page, setPage] = useState(PAGE_DEFAULT);
  const [pageSize, setPageSize] = useState<PageSizeType>(PAGE_SIZE_DEFAULT);
  const [dataTable, setDataTable] = useState({ columns: columnsDataTable, rows: [] });
  const [selectedIds, setSelectedIds] = useState([]);

  const query = useQuery();
  const customerId = query.get("customer") ?? getCustomerId() ?? null;

  const dispatch = useDispatch();
  const { actions: toastActions } = useToastifySlice();
  const { actions: paymentActions } = usePaymentSlice();

  const paymentList = useSelector(selectPaymentList);
  const pagination = useSelector(selectPaymentPagination);

  useEffect(() => {
    setDataTable({
      ...dataTable,
      rows: paymentList,
    });
  }, [paymentList]);

  const getData = async () => {
    dispatch(paymentActions.getAllRequest({ page, pageSize, customerId }));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleGoToPage = currentPage => {
    setPage(currentPage);
  };

  const handleSelectPageSize = entries => {
    setPageSize(entries);
    setPage(1);
  };

  const handleSelected = list => {
    setSelectedIds(list);
  };

  const sendReciept = async ids => {
    if (!ids.length) {
      dispatch(
        toastActions.notify({
          type: IToastType.ERROR,
          title: `Send PDF Invoice download failed`,
          content: "Please select an invoice to send",
        })
      );
      return;
    }
    dispatch(
      paymentActions.sendPDFRecieptRequest({
        invoiceList: ids,
        actionSuccess: () => setSelectedIds([]),
      })
    );
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox p={3} lineHeight={1}>
          <MDTypography variant="h5" fontWeight="medium">
            Payments
          </MDTypography>
        </MDBox>
        <DataTable
          table={dataTable}
          paginationData={pagination}
          gotoPage={handleGoToPage}
          handleSelectPageSize={handleSelectPageSize}
          selected={{
            isShow: true,
            field: "id",
            isClearSelected: selectedIds.length ? false : true,
            handleSelected,
          }}
          childrenLeft={
            <MDBox mx={2}>
              <MDButton
                color="success"
                variant="contained"
                size="small"
                p={3}
                onClick={() => {
                  sendReciept(selectedIds);
                }}
              >
                Send reciepts
              </MDButton>
            </MDBox>
          }
        />
      </Card>
    </DashboardLayout>
  );
}
