import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import lodash from 'lodash';

import { useGoToInvoiceList } from 'src/effects/useNavigation';
import {
  deleteInvoice,
  issueInvoice,
} from 'src/api/interfaces/consolidatedInvoice';
import notify from 'src/service/NotifyService';

import { useContext } from '../effects';
import { LINKS, DELETE_SUCCESS_MESSAGE } from '../config';
import { ManageInvoiceService as manageInvoiceService } from '../services';

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: spacing(2),
  },
}));

export default () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const classes = useStyles();
  const goToInvoiceList = useGoToInvoiceList();
  const [isLoading, setIsLoading] = React.useState(false);
  const { invoiceContext } = useContext();

  const handleDiscardClick = () => {
    setIsLoading(true);

    deleteInvoice(id)
      .then(() => {
        notify.success(t(DELETE_SUCCESS_MESSAGE), {
          afterShow: () => {
            goToInvoiceList();
          },
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleIssueClick = () => {
    setIsLoading(true);

    issueInvoice(id)
      .then(() => {
        manageInvoiceService.updateInvoice();
      })
      .finally(() => setIsLoading(false));
  };

  const handleBackClick = () => {
    goToInvoiceList();
  };

  const showDiscardAction = () =>
    lodash.has(invoiceContext.values?.links, LINKS.InvoicesDelete);

  const showIssueAction = () =>
    lodash.has(invoiceContext.values?.links, LINKS.InvoicesIssue);

  return (
    <div className={classes.container}>
      {showDiscardAction() ? (
        <Button
          className={classes.button}
          disabled={isLoading}
          variant="outlined"
          color="primary"
          onClick={handleDiscardClick}
        >
          {t('Discard')}
        </Button>
      ) : null}
      <Button
        className={classes.button}
        disabled={isLoading}
        variant="outlined"
        color="primary"
        onClick={handleBackClick}
      >
        {t('Back')}
      </Button>
      {showIssueAction() ? (
        <Button
          className={classes.button}
          disabled={isLoading}
          color="primary"
          variant="contained"
          onClick={handleIssueClick}
        >
          {t('Issue Invoice')}
        </Button>
      ) : null}
    </div>
  );
};
