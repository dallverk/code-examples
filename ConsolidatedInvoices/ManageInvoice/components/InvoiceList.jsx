import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';
import lodash from 'lodash';

import CursorTable from 'src/components/CursorTable';
import allocationsListConfig from 'src/containers/Invoicing/Allocations/AllocationListConfig.json';
import makeTableStyles from 'src/effects/makeTableStyles';
import makePaginationCursor from 'src/hooks/makePaginationCursor';
import { ledger } from 'src/api/endpoint';
import { getAddedInvoicesUrl } from 'src/api/consolidatedInvoice';
import {
  removeInvoiceFromInvoice,
  creditInvoice,
} from 'src/api/interfaces/consolidatedInvoice';
import TableContainer from 'src/components/PaginatedTable/TableList/TableContainer';
import { QuestionDialog } from 'src/components/ConfirmationDialog';
import Loading from 'src/components/Loading';
import { useGoToConsolidatedInv } from 'src/effects/useNavigation';

import ConsolidatedInvoice from '../ConsolidatedInvoice';
import {
  useColumns,
  useContext,
  useInvoiceListReducer,
  UPDATE_PAGE_SELECTION,
  UPDATE_ALL_PAGE_SELECTION,
} from '../effects';
import { LINKS, ROWS_PER_PAGE } from '../config';
import { ManageInvoiceService as manageInvoiceService } from '../services';

import InvoiceListActions from './InvoiceListActions';
import InvoiceListFooter from './InvoiceListFooter';

const useTableStyles = makeTableStyles(allocationsListConfig);

export default () => {
  const { table } = useTableStyles();
  const { id } = useParams();
  const [pendingInvoiceRemove, setPendingInvoiceRemove] = React.useState(null);
  const [isLoading, setIsLoaing] = React.useState(false);
  const [state, dispatch] = useInvoiceListReducer();
  const { invoiceContext } = useContext();
  const goToConsolidatedInv = useGoToConsolidatedInv();

  const usePaginationCursor = React.useMemo(
    () => makePaginationCursor(ledger, () => getAddedInvoicesUrl(id), false),
    [id]
  );

  const paginationCursor = usePaginationCursor({
    limit: ROWS_PER_PAGE,
    id,
  });

  React.useEffect(
    () =>
      manageInvoiceService.subscribeLinkedInvoices(() => {
        paginationCursor.action.forceUpdate();
      }),
    []
  );

  const handleRemoveConfirm = invoice => setPendingInvoiceRemove(invoice);
  const handleRemoveCancel = () => setPendingInvoiceRemove(null);

  const handleRemove = () => {
    setPendingInvoiceRemove(false);

    if (!pendingInvoiceRemove) return;

    setIsLoaing(true);

    removeInvoiceFromInvoice(id, pendingInvoiceRemove.invoiceNo)
      .then(data => {
        invoiceContext.actions?.setInvoice(new ConsolidatedInvoice(data));

        paginationCursor.action.forceUpdate();
        manageInvoiceService.updateInvoices();
      })
      .finally(() => {
        setIsLoaing(false);
      });
  };

  const columns = useColumns({
    actions: {
      onRemove: lodash.has(invoiceContext.values?.links, LINKS.InvoicesDelete)
        ? handleRemoveConfirm
        : null,
    },
  });

  const formatRowsData = data => {
    if (!Array.isArray(data)) return data;

    return data.map(item => item.data);
  };

  const onRowCheckboxesChange = rows => {
    const page = paginationCursor.state?.page;

    dispatch({
      type: UPDATE_PAGE_SELECTION,
      payload: { rows, page },
    });
  };

  const onHeadCheckboxesChange = selected => {
    const page = paginationCursor.state?.page;

    if (!selected) {
      dispatch({ type: UPDATE_PAGE_SELECTION, payload: { rows: [], page } });

      return;
    }

    if (!Array.isArray(paginationCursor.data?.payload)) return;

    const rows = paginationCursor.data.payload;

    dispatch({ type: UPDATE_ALL_PAGE_SELECTION, payload: { rows, page } });
  };

  const isRowCheckboxVisible = row => {
    const invoice = new ConsolidatedInvoice(row);

    if (!Array.isArray(paginationCursor.data?.payload)) return false;

    const cursorRow = paginationCursor.data.payload.find(
      item => item.data.invoiceNo === invoice.invoiceNo
    );

    if (!cursorRow) return false;

    return !!cursorRow.meta?.canCredit;
  };

  const creditActionDisabled = React.useMemo(
    () => isLoading || lodash.isEmpty(state.selectedInvoices.filter(Boolean)),
    [isLoading, state.selectedInvoices]
  );

  const canCreditInvoice = React.useMemo(
    () => lodash.has(invoiceContext.values.links, LINKS.InvoicesCredit),
    [invoiceContext.values.links]
  );

  const handleCreditClick = () => {
    setIsLoaing(true);

    const payload = state.selectedInvoices.map(invoice => invoice.invoiceNo);

    creditInvoice(id, { invoices: payload })
      .then(({ consolidatedInvoiceId }) => {
        if (consolidatedInvoiceId) goToConsolidatedInv(consolidatedInvoiceId);
      })
      .finally(() => {
        setIsLoaing(false);
      });
  };

  const checkedRows = React.useMemo(() => {
    const page = paginationCursor.state?.page;

    const pageSelection = lodash.get(state.pageSelection, page, []);

    return pageSelection;
  }, [state.pageSelection, paginationCursor]);

  return (
    <Box position="relative">
      <TableContainer title="Invoices">
        {isLoading ? <Loading overlay /> : null}
        <CursorTable
          classNames={{ table }}
          cursorPagination={paginationCursor}
          columns={columns}
          formatRowsData={formatRowsData}
          hasCheckboxes={canCreditInvoice}
          onRowCheckboxesChange={onRowCheckboxesChange}
          isRowCheckboxVisible={isRowCheckboxVisible}
          checkedRows={checkedRows}
          onHeadCheckboxChange={onHeadCheckboxesChange}
          tableCyId="invoice-list"
        />
      </TableContainer>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
        {canCreditInvoice ? (
          <InvoiceListFooter selectedInvoices={state.selectedInvoices} />
        ) : null}
        <InvoiceListActions
          showCreditAction={canCreditInvoice}
          onCredit={handleCreditClick}
          disabled={creditActionDisabled}
        />
      </Box>
      <QuestionDialog
        open={!!pendingInvoiceRemove}
        onConfirm={handleRemove}
        onClose={handleRemoveCancel}
        questionTitle={'Are you sure you want to remove the invoice?'}
        questionConfirm={'Confirm'}
        questionDeny={'Cancel'}
      />
    </Box>
  );
};
