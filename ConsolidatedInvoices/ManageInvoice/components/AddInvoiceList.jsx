import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';

import CursorTable from 'src/components/CursorTable';
import allocationsListConfig from 'src/containers/Invoicing/Allocations/AllocationListConfig.json';
import makeTableStyles from 'src/effects/makeTableStyles';
import makePaginationCursor from 'src/hooks/makePaginationCursor';
import { ledger } from 'src/api/endpoint';
import { getAvailableInvoicesUrl } from 'src/api/consolidatedInvoice';
import { addInvoiceToInvoice } from 'src/api/interfaces/consolidatedInvoice';
import TableContainer from 'src/components/PaginatedTable/TableList/TableContainer';
import Loading from 'src/components/Loading';

import { useColumns, useContext } from '../effects';
import { ManageInvoiceService as manageInvoiceService } from '../services';
import { ROWS_PER_PAGE } from '../config';
import ConsolidatedInvoice from '../ConsolidatedInvoice';

const useTableStyles = makeTableStyles(allocationsListConfig);

export default () => {
  const { table } = useTableStyles();
  const { id } = useParams();
  const { invoiceContext } = useContext();

  const [isLoading, setIsLoaing] = React.useState(false);

  const usePaginationCursor = React.useMemo(
    () =>
      makePaginationCursor(ledger, () => getAvailableInvoicesUrl(id), false),
    [id]
  );

  const paginationCursor = usePaginationCursor({
    limit: ROWS_PER_PAGE,
    id,
  });

  React.useEffect(
    () =>
      manageInvoiceService.subscribeInvoices(() => {
        paginationCursor.action.forceUpdate();
      }),
    []
  );

  const handleAdd = invoice => {
    if (!invoice) return;

    setIsLoaing(true);

    addInvoiceToInvoice(id, invoice.invoiceNo)
      .then(data => {
        invoiceContext.actions?.setInvoice(new ConsolidatedInvoice(data));

        paginationCursor.action.forceUpdate();
        manageInvoiceService.updateLinkedInvoices();
      })
      .finally(() => {
        setIsLoaing(false);
      });
  };

  const columns = useColumns({
    actions: { onAdd: handleAdd },
  });

  const formatRowsData = data => {
    if (!Array.isArray(data)) return data;

    return data.map(item => item.data);
  };

  return (
    <Box position="relative">
      <TableContainer title="Add invoices">
        {isLoading ? <Loading overlay /> : null}
        <CursorTable
          classNames={{ table }}
          cursorPagination={paginationCursor}
          columns={columns}
          formatRowsData={formatRowsData}
          tableCyId="add-invoice-list"
        />
      </TableContainer>
    </Box>
  );
};
