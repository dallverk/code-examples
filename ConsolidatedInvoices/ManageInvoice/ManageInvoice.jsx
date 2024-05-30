import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, Grid, Box } from '@material-ui/core';
import lodash from 'lodash';

import { getInvoice } from 'src/api/interfaces/consolidatedInvoice';
import Loading from 'src/components/Loading';
import Container from 'src/components/Container';

import ConsolidatedInvoice from './ConsolidatedInvoice';
import {
  InvoiceStatus,
  InvoiceList,
  AddInvoiceList,
  InvoiceHeader,
  InvoiceActions,
} from './components';
import { LINKS } from './config';
import { useContext } from './effects';
import { PAGE_TITLE } from './Page';
import { ManageInvoiceService as manageInvoiceService } from './services';
import InvoiceDocuments from './components/InvoiceDocuments';

export default () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { invoiceContext } = useContext();

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(
    () =>
      manageInvoiceService.subscribeInvoiceUpdate(() => {
        fetchData();
      }),
    []
  );

  const fetchData = React.useCallback(() => {
    setIsLoading(true);

    getInvoice(id)
      .then(({ data, links }) => {
        invoiceContext.actions?.setLinks(links);

        invoiceContext.actions.setInvoice(new ConsolidatedInvoice(data));
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showAddedInvoicesList = () =>
    lodash.has(invoiceContext.values?.links, LINKS.AddedInvoicesList);

  const showAvailableInvoicesList = () =>
    lodash.has(invoiceContext.values?.links, LINKS.AvailableInvoicesList);

  const showDocumentsList = () =>
    lodash.has(invoiceContext.values?.links, LINKS.InvoicesDocumentsList);

  const invoice = React.useMemo(() => invoiceContext.values.invoice, [
    invoiceContext.values,
  ]);

  if (!isLoading && error)
    return (
      <Container maxWidth={false}>
        <Container.Header>
          <Grid item container direction="row" alignItems="center" spacing={2}>
            <Grid item>
              <Typography component="h1" variant="h1">
                {t(PAGE_TITLE)}
              </Typography>
            </Grid>
          </Grid>
        </Container.Header>
        <Container.Body>{error.message}</Container.Body>
      </Container>
    );

  if (isLoading)
    return (
      <Container maxWidth={false}>
        <Container.Header>
          <Grid item container direction="row" alignItems="center" spacing={2}>
            <Grid item>
              <Typography component="h1" variant="h1">
                {t(PAGE_TITLE)}
              </Typography>
            </Grid>
          </Grid>
        </Container.Header>
        <Container.Body>
          <Loading />
        </Container.Body>
      </Container>
    );

  return (
    <Container maxWidth={false}>
      <Container.Header>
        <Grid item container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <Typography component="h1" variant="h1">
              {t(PAGE_TITLE)} {invoice.invoiceNo}
            </Typography>
          </Grid>
          <Grid item>
            <InvoiceStatus data={invoice} />
          </Grid>
          <Grid item xs alignContent="end">
            <InvoiceActions />
          </Grid>
        </Grid>
      </Container.Header>
      <Container.Body>
        <Box mb={4}>
          <InvoiceHeader invoice={invoice} />
        </Box>
        {showAddedInvoicesList() ? (
          <Box mb={4}>
            <InvoiceList />
          </Box>
        ) : null}
        {showAvailableInvoicesList() ? (
          <Box mb={4}>
            <AddInvoiceList />
          </Box>
        ) : null}
        {showDocumentsList() && (
          <Box>
            <InvoiceDocuments />
          </Box>
        )}
      </Container.Body>
    </Container>
  );
};
