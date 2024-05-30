import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';

import getSchemaState from 'src/helpers/getSchemaState';
import Loading from 'src/components/Loading';
import { ActionButton, ActionButtonGroup } from 'src/containers/Claim/Actions';
import { useGoToPublicFnolProducts } from 'src/effects/useNavigation';
import {
  getLatestSchemaWithInfo,
  getLatestUISchemaWithInfo,
} from 'src/api/interfaces/schema';
import { createFnolExternal } from 'src/api/interfaces/claims';

import { SchemaForm, SchemaContext } from './SchemaProvider';

const useStyles = makeStyles(({ spacing }) => ({
  actionsGroup: {
    padding: spacing(3, 0),
  },
}));

export default ({ onSuccess }) => {
  const classes = useStyles();
  const { type, name } = useParams();
  const context = React.useContext(SchemaContext);

  const goToPublicFnolProducts = useGoToPublicFnolProducts();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateClaim = async () => {
    const errors = await context.actions.validateForm();

    if (errors.length) return;
    setIsSubmitting(true);

    try {
      const data = await createFnolExternal(context.values.formData);

      onSuccess && onSuccess(data.uuid);
    } catch (error) {
      context.extraErrors.setErrors(error.errors);

      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);

    (async () => {
      const [schema, uiSchema] = await Promise.all([
        getLatestSchemaWithInfo(type, name),
        getLatestUISchemaWithInfo(type, name),
      ]);
      const formData = getSchemaState(schema);

      context.actions.setSchema(schema);
      context.actions.setUiSchema(uiSchema);
      context.actions.setFormData(formData);

      setIsLoading(false);
    })();
  }, [type, name]);

  if (isLoading) return <Loading />;

  return (
    <>
      {isSubmitting ? <Loading /> : <SchemaForm showNotifications />}
      <ActionButtonGroup className={classes.actionsGroup}>
        <ActionButton
          disabled={isSubmitting}
          onClick={handleCreateClaim}
          variant="contained"
          name={'Create claim'}
        />
        <ActionButton
          disabled={isSubmitting}
          onClick={goToPublicFnolProducts}
          variant="outlined"
          name={'Cancel'}
        />
      </ActionButtonGroup>
    </>
  );
};
