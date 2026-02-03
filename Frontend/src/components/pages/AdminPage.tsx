import { useState } from "react";

import { format } from "date-fns";
import { useDeleteResource, useResources } from "../hooks/use-resources";

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editResource, setEditResource] = useState<
    (any & { id: number }) | null
  >(null);

  const { data: resources, isLoading } = useResources({ search: search });
  const deleteMutation = useDeleteResource();

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            Manage Resources
          </h1>
          <p style={{ color: "#666" }}>
            Add, edit, or remove content from the library.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
          }}
        >
          + Add Resource
        </button>
      </div>

      {/* Create Resource Form */}
      {createOpen && (
        <div
          style={{
            marginBottom: "1rem",
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "0.25rem",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            Add New Resource
          </h2>
          <button
            onClick={() => setCreateOpen(false)}
            style={{ marginTop: "0.5rem" }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            maxWidth: "300px",
            border: "1px solid #ccc",
            borderRadius: "0.25rem",
          }}
        />
      </div>

      {/* Resource Table */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>Loading...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Title</th>
              <th style={{ padding: "0.5rem" }}>Type</th>
              <th style={{ padding: "0.5rem" }}>Difficulty</th>
              <th style={{ padding: "0.5rem" }}>Created</th>
              <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources?.items?.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#666",
                  }}
                >
                  No resources found.
                </td>
              </tr>
            ) : (
              resources?.items?.map((resource: any) => (
                <tr
                  key={resource.id}
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <td style={{ padding: "0.5rem", fontWeight: "bold" }}>
                    {resource.title}
                    <div style={{ fontSize: "0.75rem", color: "#888" }}>
                      {resource.slug}
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    {resource.resourceType}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "center" }}>
                    {resource.difficulty}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    {format(
                      new Date(resource.createdAt || new Date()),
                      "MMM d, yyyy",
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    <button
                      onClick={() => setEditResource(resource)}
                      style={{
                        marginRight: "0.5rem",
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        cursor: "pointer",
                        color: "white",
                        backgroundColor: "#dc2626",
                        border: "none",
                        borderRadius: "0.25rem",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Edit Form */}
      {editResource && (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ddd",
            padding: "1rem",
            borderRadius: "0.25rem",
            backgroundColor: "#fafafa",
          }}
        >
          <h2 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
            Edit Resource
          </h2>
          <button
            resource={editResource}
            onClick={() => setEditResource(null)}
          />
          <button
            onClick={() => setEditResource(null)}
            style={{ marginTop: "0.5rem" }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
