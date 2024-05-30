import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core';

import ReferralMessage from 'src/schema/views/common/ReferralMessage';
import ErrorList from 'src/schema/views/common/ErrorList';
import { convertIdToPath } from 'src/helpers/schemas';

import useFieldDiff from './useFieldDiff';
import fieldWrapper from './fieldWrapper';

const useStyle = makeStyles({
  field: {
    flexBasis: props => `${props.basis || 100}%`,
    display: props => (props.hidden ? 'none' : 'block'),
  },
});

const Field = props => {
  const {
    uiSchema,
    children,
    rawErrors,
    fieldPath,
    formContext,
    inHidden,
  } = props;

  const classes = useStyle({
    basis: uiSchema.basis,
    hidden: inHidden,
  });

  const { fieldsDiffClasses, fieldDiff } = useFieldDiff(
    formContext.fieldsDiff,
    uiSchema,
    fieldPath
  );

  const referralMessage = formContext?.referralSchema?.[fieldPath];

  const Component = (
    <>
      {children}
      <ReferralMessage message={referralMessage} />
      <ErrorList errors={rawErrors} />
    </>
  );

  return fieldWrapper(Component, {
    className: clsx(classes.field, fieldsDiffClasses),
    fieldDiff,
  });
};

export default props => {
  const hiddenFields = React.useMemo(
    () => props.formContext?.hiddenFields ?? [],
    [props.formContext?.hiddenFields]
  );
  const fieldPath = React.useMemo(() => convertIdToPath(props.id), [
    hiddenFields,
    props.id,
  ]);
  const inHidden = hiddenFields.includes(fieldPath);

  if (props.hidden) return null;

  return <Field {...props} fieldPath={fieldPath} inHidden={inHidden} />;
};
