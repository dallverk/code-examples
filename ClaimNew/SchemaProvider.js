import { customSchemaFactory } from 'src/schema';

export const {
  CustomSchemaForm: SchemaForm,
  CustomSchemaProvider: SchemaProvider,
  CustomSchemaContext: SchemaContext,
} = customSchemaFactory();
