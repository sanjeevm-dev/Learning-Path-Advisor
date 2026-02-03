import { useState } from "react";
import { useResources } from "../hooks/use-resources";
import { DIFFICULTIES, RESOURCE_TYPES } from "../ui/ResourceForm";

// Simple ResourceCard component
function ResourceCard({ resource }: { resource: any }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-1">{resource.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{resource.resourceType}</span>
        <span>{resource.difficulty}</span>
      </div>
    </div>
  );
}

// Simple Skeleton component for loading state
function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const {
    data: resources = [],
    isLoading,
    error,
  } = useResources({
    search: search,
    resourceType: type !== "all" ? type : undefined,
    difficulty: difficulty !== "all" ? difficulty : undefined,
  });

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-blue-50 border border-blue-100 px-6 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Learning Library
        </h1>
        <p className="text-gray-600 mb-4">
          Discover curated resources to help you master new skills.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            Get AI Recommendations
          </button>
          <button className="px-8 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition">
            Manage Library
          </button>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-4 z-40 bg-white p-4 rounded-xl border shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Types</option>
          {RESOURCE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Levels</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600">
          <p>Error loading resources. Please try again.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource: any) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}
