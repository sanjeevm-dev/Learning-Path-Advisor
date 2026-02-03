import { ObjectSchema, ValidationOptions } from "joi";
import createHttpError from "http-errors";

interface SchemaValidator<T> {
  schema: ObjectSchema<T>;
  data: unknown;
  options?: ValidationOptions;
}

export const validateJoiSchema = <T>({
  schema,
  data,
  options,
}: SchemaValidator<T>): void => {
  const { error } = schema.validate(data, options);

  if (error) {
    throw createHttpError(400, error.details.map((d) => d.message).join(", "));
  }
};

export default validateJoiSchema;
