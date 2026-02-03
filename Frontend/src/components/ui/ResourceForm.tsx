import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCreateResource, useUpdateResource } from "../hooks/use-resources";
import type { InsertResource, Resource } from "../../types/types";
import { RESOURCE_TYPES, DIFFICULTIES } from "../../types/types";

interface ResourceFormProps {
  resource?: Resource;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  slug: Yup.string().required("Slug is required"),
  description: Yup.string().required("Description is required"),
  resourceType: Yup.string().oneOf(RESOURCE_TYPES).required("Type is required"),
  difficulty: Yup.string()
    .oneOf(DIFFICULTIES)
    .required("Difficulty is required"),
  estimatedMinutes: Yup.number()
    .min(1, "Must be at least 1 minute")
    .required("Estimated minutes required"),
  tagsString: Yup.string(),
});

export const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  onSuccess,
}) => {
  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();

  return (
    <Formik
      initialValues={{
        title: resource?.title || "",
        slug: resource?.slug || "",
        description: resource?.description || "",
        resourceType: resource?.resourceType || "Article",
        difficulty: resource?.difficulty || "Beginner",
        estimatedMinutes: resource?.estimatedMinutes || 15,
        tagsString: resource?.tags ? resource.tags.join(", ") : "",
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const tags = values.tagsString
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);

        const payload: InsertResource = {
          title: values.title,
          slug: values.slug,
          description: values.description,
          resourceType: values.resourceType,
          difficulty: values.difficulty,
          estimatedMinutes: values.estimatedMinutes,
          tags,
        };

        try {
          if (resource?.id) {
            await updateMutation.mutateAsync({ id: resource.id, ...payload });
          } else {
            await createMutation.mutateAsync(payload);
          }
          onSuccess?.();
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Title
            </label>
            <Field
              name="title"
              placeholder="Intro to React"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <ErrorMessage name="title">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Slug
            </label>
            <Field
              name="slug"
              placeholder="intro-to-react"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <ErrorMessage name="slug">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <Field
              name="description"
              as="textarea"
              placeholder="What is this resource about?"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <ErrorMessage name="description">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Type
            </label>
            <Field
              name="resourceType"
              as="select"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="resourceType">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Difficulty
            </label>
            <Field
              name="difficulty"
              as="select"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Field>
            <ErrorMessage name="difficulty">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Estimated Minutes
            </label>
            <Field
              name="estimatedMinutes"
              type="number"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <ErrorMessage name="estimatedMinutes">
              {(msg) => (
                <div className="text-xs text-red-600" aria-live="polite">
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Tags (comma separated)
            </label>
            <Field
              name="tagsString"
              placeholder="react, frontend, javascript"
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resource ? "Update Resource" : "Create Resource"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
