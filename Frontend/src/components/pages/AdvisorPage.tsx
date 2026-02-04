import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { fetchAIRecommendation } from "../../redux/aiSlice";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "../../types/types";

import { ResourceCard } from "../ui/ResourceCard";

const validationSchema = Yup.object({
  goal: Yup.string().required("Learning goal is required"),
  maxItems: Yup.number()
    .min(2, "Minimum 2 items")
    .max(8, "Maximum 8 items")
    .required("Number of items is required"),
});

export default function AdvisorPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const aiState = useSelector((state: RootState) => state.ai);

  const handleSubmit = async (values: RecommendationRequest) => {
    try {
      setRecommendation(null);
      const result = await dispatch(fetchAIRecommendation(values)).unwrap();
      setRecommendation(result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate recommendation");
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold">What do you want to learn today?</h1>
        <p className="text-gray-600">
          Describe your learning goals, and our AI advisor will curate a
          personalized path.
        </p>
      </div>

      <div className="flex flex-wrap gap-8">
        {/* Form */}
        <div className="flex-1 min-w-[250px]">
          <div className="rounded-lg border border-gray-300 p-4">
            <Formik
              initialValues={{ goal: "", maxItems: 4 }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="goal" className="mb-1 block font-medium">
                      Learning Goal
                    </label>
                    <Field
                      as="textarea"
                      id="goal"
                      name="goal"
                      placeholder="I want to learn React hooks and state management..."
                      className="w-full min-h-[100px] rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage
                      name="goal"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="maxItems"
                      className="mb-1 block font-medium"
                    >
                      Number of Resources: <strong>{values.maxItems}</strong>
                    </label>
                    <input
                      type="range"
                      id="maxItems"
                      min={2}
                      max={8}
                      step={1}
                      value={values.maxItems}
                      onChange={(e) =>
                        setFieldValue("maxItems", Number(e.target.value))
                      }
                      className="w-full"
                    />
                    <ErrorMessage
                      name="maxItems"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || aiState.loading || !values.goal}
                    className="rounded-full bg-blue-600 px-8 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {aiState.loading ? "Generating Path..." : "Generate Path"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Results */}
        <div className="flex-[2] min-w-[300px]">
          {aiState.loading && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
              <p className="text-gray-600">Analyzing your goal...</p>
            </div>
          )}

          {!aiState.loading && !recommendation && (
            <div className="border border-dashed border-gray-300 p-8 text-center text-gray-600">
              <p>Enter your goal to generate a custom learning path.</p>
            </div>
          )}

          {recommendation && (
            <div>
              <div className="mb-4 rounded-lg border border-blue-600 p-4">
                <h2 className="text-lg font-semibold">
                  {recommendation.summary}
                </h2>
                <p className="text-gray-700">{recommendation.explanation}</p>
                <p className="mt-2">
                  Total Estimated Minutes:{" "}
                  <strong>{recommendation.totalEstimatedMinutes}</strong>
                </p>
              </div>

              <div className="space-y-4">
                {recommendation.resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} compact />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
