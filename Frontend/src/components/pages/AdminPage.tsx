import { useState } from "react";

import { format } from "date-fns";
import { useDeleteResource, useResources } from "../hooks/use-resources";
import { ResourceForm } from "../ui/ResourceForm";
import { Modal } from "../ui/Modal";
import type { Resource } from "../../types/types";

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);

  const { data: resources = [], isLoading } = useResources({ q: search });
  const deleteMutation = useDeleteResource();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Resources
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Add, edit, or remove content from the library.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          + Add Resource
        </button>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Resource Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="py-10 text-center text-slate-500">Loading...</div>
        ) : resources.length === 0 ? (
          <div className="py-10 text-center text-slate-500">
            No resources found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Durration (min)
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {resources.map((resource) => (
                <tr key={resource.id}>
                  <td className="px-4 py-3 align-top">
                    <div className="font-medium text-slate-900">
                      {resource.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {resource.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    {resource.resourceType}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-700">
                    {resource.difficulty}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-500">
                    {format(
                      new Date(resource.createdAt || new Date()),
                      "MMM d, yyyy",
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-500">
                    {resource.estimatedMinutes}
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <button
                      type="button"
                      onClick={() => setEditResource(resource)}
                      className="mr-2 inline-flex items-center rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(resource.id)}
                      className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add New Resource"
      >
        <ResourceForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editResource}
        onClose={() => setEditResource(null)}
        title="Edit Resource"
      >
        {editResource && (
          <ResourceForm
            resource={editResource}
            onSuccess={() => setEditResource(null)}
          />
        )}
      </Modal>
    </div>
  );
}
