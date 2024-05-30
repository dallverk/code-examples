import React from 'react';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { usePriceField } from 'src/effects/fields';

export default ({ selectedInvoices }) => {
  const { t } = useTranslation();
  const priceFieldFormatter = usePriceField();

  const selectedInvoicesCount = selectedInvoices.filter(Boolean).length;
  const selectedInvoicesSum = selectedInvoices
    .filter(Boolean)
    .reduce((acc, invoice) => {
      acc += invoice.invoiceSum;

      return acc;
    }, 0);

  return (
    <>
      <Box mr={2}>
        <span>{t('Selected')}: </span>
        <span>{selectedInvoicesCount}</span>
      </Box>
      <Box mr={2}>
        <span>{t('Sum')}: </span>
        <span>{priceFieldFormatter(selectedInvoicesSum)}</span>
      </Box>
    </>
  );
};
