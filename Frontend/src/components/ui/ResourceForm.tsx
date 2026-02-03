import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createResource, updateResource } from "../../redux/resourcesSlice";
import type { Resource } from "../../redux/resourcesSlice";

export const RESOURCE_TYPES = ["article", "video", "tutorial", "course"];
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

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
  const dispatch = useDispatch();

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
        const payload: Resource = {
          id: resource?.id || 0,
          ...values,
          tags,
        } as Resource;

        try {
          if (resource?.id) {
            await dispatch(updateResource(payload));
          } else {
            await dispatch(createResource(payload));
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
        <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Title</label>
            <Field name="title" placeholder="Intro to React" />
            <ErrorMessage
              name="title"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Slug</label>
            <Field name="slug" placeholder="intro-to-react" />
            <ErrorMessage
              name="slug"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Description</label>
            <Field
              name="description"
              as="textarea"
              placeholder="What is this resource about?"
            />
            <ErrorMessage
              name="description"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Type</label>
            <Field name="resourceType" as="select">
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="resourceType"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Difficulty</label>
            <Field name="difficulty" as="select">
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="difficulty"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Estimated Minutes</label>
            <Field name="estimatedMinutes" type="number" />
            <ErrorMessage
              name="estimatedMinutes"
              component="div"
              style={{ color: "red" }}
            />
          </div>

          <div>
            <label>Tags (comma separated)</label>
            <Field
              name="tagsString"
              placeholder="react, frontend, javascript"
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {resource ? "Update Resource" : "Create Resource"}
          </button>
        </Form>
      )}
    </Formik>
  );
};
