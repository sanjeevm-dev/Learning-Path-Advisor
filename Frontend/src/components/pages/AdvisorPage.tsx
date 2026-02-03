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

import { ResourceCard } from "../ui/ResourceCard"; // Your plain card component

// Validation schema
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
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          What do you want to learn today?
        </h1>
        <p>
          Describe your learning goals, and our AI advisor will curate a
          personalized path.
        </p>
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Form */}
        <div style={{ flex: "1 1 250px" }}>
          <div
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Formik
              initialValues={{ goal: "", maxItems: 4 }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, values, setFieldValue }) => (
                <Form
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label htmlFor="goal">Learning Goal</label>
                    <Field
                      as="textarea"
                      id="goal"
                      name="goal"
                      placeholder="I want to learn React hooks and state management..."
                      style={{
                        width: "100%",
                        minHeight: "100px",
                        padding: "0.5rem",
                      }}
                    />
                    <ErrorMessage name="goal">
                      {(msg) => (
                        <div style={{ color: "red" }}>{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  <div>
                    <label htmlFor="maxItems">
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
                      style={{ width: "100%" }}
                    />
                    <ErrorMessage name="maxItems">
                      {(msg) => (
                        <div style={{ color: "red" }}>{msg}</div>
                      )}
                    </ErrorMessage>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || aiState.loading}
                    className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                  >
                    {aiState.loading ? "Generating Path..." : "Generate Path"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Results */}
        <div style={{ flex: "2 1 500px" }}>
          {aiState.loading && (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  border: "4px solid #ccc",
                  borderTop: "4px solid #333",
                  borderRadius: "50%",
                  margin: "0 auto",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p>Analyzing your goal...</p>
            </div>
          )}

          {!aiState.loading && !recommendation && (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                border: "1px dashed #ccc",
              }}
            >
              <p>Enter your goal to generate a custom learning path.</p>
            </div>
          )}

          {recommendation && (
            <div>
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid #0070f3",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <h2>{recommendation.summary}</h2>
                <p>{recommendation.explanation}</p>
                <p>
                  Total Estimated Minutes:{" "}
                  <strong>{recommendation.totalEstimatedMinutes}</strong>
                </p>
              </div>

              <div>
                {recommendation.resources.map((resource) => (
                  <div key={resource.id} style={{ marginBottom: "1rem" }}>
                    <ResourceCard resource={resource} compact />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
