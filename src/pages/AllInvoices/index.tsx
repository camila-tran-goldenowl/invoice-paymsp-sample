/* eslint-disable react-hooks/exhaustive-deps */
// libs
import { useQuery } from "hooks/useQuery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// core components
import Card from "@mui/material/Card";

// component
import MDBox from "components/MDBox";
import MDModal from "components/MDModal";
import DataTable from "components/Tables";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PDFEmailForm from "./components/PDFEmailForm";
import PaynowEmailForm from "./components/PaynowEmailForm";
import RecieptEmailForm from "./components/RecieptEmailForm";
import PaymentNow from "pages/Invoice/components/PaymentNowForm";
import DashboardLayout from "components/LayoutContainer/DashboardLayout";

// data
import { statusDropdown } from "./data/dropdown";
import { columnResource, columnsDataTable } from "./data/columnDataTable";
import { PAGE_DEFAULT, PAGE_SIZE_DEFAULT } from "utils/constants";

// type
import { PageSizeType } from "types/Table";

// utils
import { isAdminGroup } from "utils/roles";
import { exportToFile } from "utils/exportFile";
import { getCustomerId } from "utils/localStorageUtil";

// saga
import { useSlice as useInvoicesSlice } from "./slice";
import { useModalSlice } from "components/MDModal/slice";
import { selectModal } from "components/MDModal/slice/selectors";
import { useToastifySlice, IToastType } from "components/Toastify/slice";
import { selectInvoicesList, selectInvoicesPagination } from "./slice/selectors";

export function AllInvoicesPage(): JSX.Element {
  const [page, setPage] = useState(PAGE_DEFAULT);
  const [pageSize, setPageSize] = useState<PageSizeType>(PAGE_SIZE_DEFAULT);
  const [dataTable, setDataTable] = useState({
    columns: isAdminGroup() ? [...columnsDataTable, columnResource] : columnsDataTable,
    rows: [],
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const modal = useSelector(selectModal);
  const invoiceList = useSelector(selectInvoicesList);
  const pagination = useSelector(selectInvoicesPagination);

  useEffect(() => {
    setDataTable({
      ...dataTable,
      rows: invoiceList,
    });
  }, [invoiceList]);

  const query = useQuery();
  const status = query.get("status") ?? null;
  const [filter, setFilter] = useState(status);
  const [searchText, setSearchText] = useState<string>("");
  const customerId = query.get("customer") ?? getCustomerId();

  const dispatch = useDispatch();
  const { actions: modalActions } = useModalSlice();
  const { actions: toastActions } = useToastifySlice();
  const { actions: invoicesActions } = useInvoicesSlice();

  const getData = async () => {
    dispatch(
      invoicesActions.getDetailRequest({
        searchText,
        filter: status ?? filter,
        page,
        pageSize,
        customerId,
      })
    );
  };

  const handleSelected = list => {
    setSelectedIds(list);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filter, searchText]);

  const handleGoToPage = currentPage => {
    setPage(currentPage);
  };

  const handleSelectPageSize = entries => {
    setPageSize(entries);
    setPage(1);
  };

  const sendInvoice = async ids => {
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
      invoicesActions.sendPDFInvoiceRequest({
        invoiceList: ids,
        actionSuccess: () => setSelectedIds([]),
      })
    );
  };

  const handleDownloadInvoicesList = async () => {
    dispatch(
      invoicesActions.exportCSVInvoiceRequest({
        searchText,
        filter: status ?? filter,
        customerId,
        actionSuccess: data => {
          exportToFile("csv", data, "invoices");
        },
      })
    );
  };

  const handleFilterStatus = value => {
    setFilter(value);
  };

  const handleSearch = value => {
    setSearchText(value);
  };

  return (
    <DashboardLayout>
      <Card>
        <MDBox p={3} lineHeight={1}>
          <MDTypography variant="h5" fontWeight="medium">
            Invoices
          </MDTypography>
          <MDTypography variant="button" color="text">
            Invoices Imported PSA
          </MDTypography>
        </MDBox>
        <DataTable
          table={dataTable}
          paginationData={pagination}
          gotoPage={handleGoToPage}
          csvReport={{
            isShow: true,
            fileName: "invoices",
            handleGetFile: handleDownloadInvoicesList,
          }}
          filter={{
            isShow: true,
            data: statusDropdown,
            label: "Filter",
            isMultiple: false,
            defaultValue: status,
            handleChange: handleFilterStatus,
          }}
          search={{
            isShow: true,
            handleChange: handleSearch,
          }}
          selected={{
            isShow: true,
            field: "id",
            isClearSelected: selectedIds.length ? false : true,
            handleSelected,
          }}
          handleSelectPageSize={handleSelectPageSize}
          childrenLeft={
            <MDBox mx={2}>
              {isAdminGroup() ? (
                <MDButton
                  color="success"
                  variant="contained"
                  size="small"
                  p={3}
                  onClick={() => {
                    sendInvoice(selectedIds);
                  }}
                >
                  Send invoices
                </MDButton>
              ) : (
                <MDButton
                  color="success"
                  variant="contained"
                  size="small"
                  p={3}
                  onClick={() => {
                    if (!selectedIds.length) {
                      dispatch(
                        toastActions.notify({
                          type: IToastType.ERROR,
                          title: `Pay Invoice failed`,
                          content: "Please select an invoice to pay",
                        })
                      );
                      return;
                    }

                    dispatch(
                      modalActions.open({
                        name: "pay-now-modal",
                        data: { invoiceIds: selectedIds },
                      })
                    );
                  }}
                >
                  Pay now
                </MDButton>
              )}
            </MDBox>
          }
        />
        <MDModal isShow={modal.name === "pay-now-modal"}>
          <MDBox width={500}>
            <PaymentNow invoiceIds={modal?.data?.invoiceIds} customerId={customerId} />
          </MDBox>
        </MDModal>
        <MDModal isShow={modal.name === "reciept-email-modal"}>
          <RecieptEmailForm
            invoiceId={modal?.data?.invoiceId}
            billingAddress={modal?.data?.billingAddress}
            successAction={getData}
          />
        </MDModal>
        <MDModal isShow={modal.name === "invoice-email-modal"}>
          <PaynowEmailForm
            invoiceId={modal?.data?.invoiceId}
            billingAddress={modal?.data?.billingAddress}
            successAction={getData}
          />
        </MDModal>
        <MDModal isShow={modal.name === "pdf-email-modal"}>
          <PDFEmailForm
            invoiceId={modal?.data?.invoiceId}
            billingAddress={modal?.data?.billingAddress}
            successAction={getData}
          />
        </MDModal>
      </Card>
    </DashboardLayout>
  );
}
