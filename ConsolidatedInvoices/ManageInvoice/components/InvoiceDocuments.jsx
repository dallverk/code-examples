import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { downloadDocument } from 'src/api/download';
import { getInvoiceDocuments } from 'src/api/interfaces/consolidatedInvoice';
import { DocumentsTitle, DocumentsTable } from 'src/components/DocumentsList';

const useStyles = makeStyles(({ spacing }) => ({
  documentsWrapper: {
    padding: spacing(3),
  },
  documentsWrapperTitle: {
    lineHeight: '24px',
    fontWeight: 700,
    fontSize: 20,
  },
  documentsWrapperBody: {
    margin: spacing(5, -1, -1),
  },
  documentsTitle: {
    paddingLeft: spacing(1.5),
    paddingRight: spacing(1.5),
  },
  documentsTable: {
    marginTop: spacing(2),
  },
}));

export default () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();

  const [documents, setDocuments] = React.useState([]);

  const handleLoad = ({ file }) =>
    downloadDocument(file.documentId, file.filename);

  const canLoad = () => true;
  const canRemove = () => false;

  React.useEffect(() => {
    getInvoiceDocuments(id)
      .then(docs => setDocuments(docs), [])
      .catch(error => console.error(error));
  }, []);

  return (
    <Paper className={classes.documentsWrapper}>
      <h3 className={classes.documentsWrapperTitle}>{t('Documents')}</h3>
      <section className={classes.documentsWrapperBody}>
        <div data-cy-output="ConsolidatedInvoiceDocuments">
          <DocumentsTitle
            className={classes.documentsTitle}
            documentsCount={documents.length}
          />
          <DocumentsTable
            className={classes.documentsTable}
            handleLoad={handleLoad}
            documents={documents}
            canLoad={canLoad}
            canRemove={canRemove}
          />
        </div>
      </section>
    </Paper>
  );
};
