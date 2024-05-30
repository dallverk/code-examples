import React from 'react';
import { useTranslation } from 'react-i18next';

import Page from 'src/components/Page';

import { InvoiceProvider } from './provider';
import ManageInvoice from './ManageInvoice';

export const PAGE_TITLE = 'Consolidated Invoice';

export default () => {
  const { t } = useTranslation();

  return (
    <InvoiceProvider>
      <Page title={t(PAGE_TITLE)}>
        <ManageInvoice />
      </Page>
    </InvoiceProvider>
  );
};
