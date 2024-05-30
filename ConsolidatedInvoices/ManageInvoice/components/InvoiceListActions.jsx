import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@material-ui/core';

import { QuestionDialog } from 'src/components/ConfirmationDialog';

export default ({ showCreditAction, disabled, onCredit }) => {
  const { t } = useTranslation();

  const [pendingInvoiceCreate, setPendingInvoiceCreate] = React.useState(null);

  const onConfirm = () => onCredit();
  const onClose = () => setPendingInvoiceCreate(null);

  const onCreditClick = () => {
    setPendingInvoiceCreate(true);
  };

  return (
    <>
      {showCreditAction ? (
        <Button
          disabled={disabled}
          variant="outlined"
          color="primary"
          onClick={onCreditClick}
        >
          {t('Credit selected')}
        </Button>
      ) : null}
      <QuestionDialog
        open={!!pendingInvoiceCreate}
        onConfirm={onConfirm}
        onClose={onClose}
        questionTitle={'Are you sure you want to create credit invoice?'}
        questionConfirm={'Confirm'}
        questionDeny={'Cancel'}
      />
    </>
  );
};
