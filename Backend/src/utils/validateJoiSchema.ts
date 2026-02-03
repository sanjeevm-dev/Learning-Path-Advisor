import { AnySchema, ValidationOptions } from "joi";
import createHttpError from "http-errors";

interface SchemaValidator {
  schema: AnySchema;
  data: unknown;
  options?: ValidationOptions;
}

export const validateJoiSchema = ({
  schema,
  data,
  options,
}: SchemaValidator): void => {
  const { error } = schema.validate(data, options);

  if (error) {
    throw createHttpError(400, error.details.map((d) => d.message).join(", "));
  }
};

export default validateJoiSchema;
