import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography, makeStyles } from '@material-ui/core';
import _ from 'lodash';

import Page from 'src/components/Page';
import Container from 'src/components/Container';
import { getClaimFeature } from 'src/api/interfaces/featuresSite';
import { useGoToPublicFnolDocs } from 'src/effects/useNavigation';
import Loading from 'src/components/Loading';

import NewClaimSuccessAlert from '../NewClaimSuccessAlert';

import ClaimForm from './ClaimForm';

const useStyles = makeStyles({
  claimBody: {
    position: 'relative',
    overflow: 'hidden',
  },
});

const CLAIM_FEATURE_NAME = 'external_fnol_documents';

export default () => {
  const classes = useStyles();
  const { name } = useParams();
  const { t } = useTranslation();

  const goToPublicFnolDocs = useGoToPublicFnolDocs();

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSuccess = uuid => {
    if (!uuid) return;

    setIsLoading(true);

    getClaimFeature(name, CLAIM_FEATURE_NAME)
      .then(config => {
        /** Navigate to documents page only if product has document types */
        if (!_.isEmpty(config)) goToPublicFnolDocs(name, uuid);
        else setIsSubmitted(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Page title={t('Create new claim')}>
      <Container>
        <Container.Header>
          <Typography component="h1" variant="h1">
            {t('New claim')}
          </Typography>
        </Container.Header>
        <Container.Body className={classes.claimBody}>
          {isLoading ? <Loading /> : null}
          {isSubmitted ? (
            <NewClaimSuccessAlert />
          ) : (
            <ClaimForm onSuccess={onSuccess} />
          )}
        </Container.Body>
      </Container>
    </Page>
  );
};
