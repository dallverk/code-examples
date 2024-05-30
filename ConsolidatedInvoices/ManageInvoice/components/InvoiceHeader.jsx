import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Grid, makeStyles } from '@material-ui/core';

import { usePriceField } from 'src/effects/fields';
import { formatDate } from 'src/components/SchemaInfo/formatters';

const useStyles = makeStyles(theme => ({
  info: {
    marginRight: theme.spacing(2),
    fontWeight: '700',
  },
}));

export default ({ invoice }) => {
  const { t } = useTranslation();
  const price = usePriceField();

  const classes = useStyles();

  if (!invoice) return '';

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Typography component="strong" variant="h4" className={classes.info}>
          {t('Broker')}
        </Typography>
        <Typography component="span" variant="h4">
          {invoice.brokerShortName}
        </Typography>
      </Grid>
      <Grid item>
        <Typography component="strong" variant="h4" className={classes.info}>
          {t('Consolidation period')}
        </Typography>
        <Typography component="span" variant="h4">
          {formatDate(invoice.periodStartDate)} -{' '}
          {formatDate(invoice.periodEndDate)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography component="strong" variant="h4" className={classes.info}>
          {t('Due date')}
        </Typography>
        <Typography component="span" variant="h4">
          {formatDate(invoice.dueDate)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography component="strong" variant="h4" className={classes.info}>
          {t('Total receivable')}
        </Typography>
        <Typography component="span" variant="h4">
          {price(invoice.totalReceivable)}
        </Typography>
      </Grid>
    </Grid>
  );
};
