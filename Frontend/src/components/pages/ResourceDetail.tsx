import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResource, useDeleteResource } from "../hooks/use-resources";
import { format } from "date-fns";
import { Modal } from "../ui/Modal";
import { ResourceForm } from "../ui/ResourceForm";
import type { Resource } from "../../types/types";

function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: "outline" | "secondary";
}) {
  const base = "px-3 py-1 rounded-full text-sm";
  const variants: Record<NonNullable<typeof variant>, string> = {
    outline: "border border-gray-300 text-gray-700 bg-gray-100",
    secondary: "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`${base} ${variant ? variants[variant] : ""}`}>
      {children}
    </span>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

function Button({ children, onClick, className = "", disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
}

function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-200 animate-pulse ${className}`} />;
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white">{children}</div>
  );
}

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: resource, isLoading } = useResource(id);
  const deleteMutation = useDeleteResource();
  const [isEditing, setIsEditing] = useState(false);
  const [editResource, setEditResource] = useState<Resource | null>(null);

  const handleDelete = async () => {
    if (!resource) return;
    await deleteMutation.mutateAsync(resource.id);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 pt-8">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Resource not found</h2>
        <Button onClick={() => navigate("/")}>Return to Library</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-20 space-y-6 mt-10">
      <Button onClick={() => navigate("/")} className="mb-6">
        ← Back to Library
      </Button>

      {/* Resource Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="outline">{resource.resourceType}</Badge>
            <Badge variant="outline">{resource.difficulty}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">{resource.title}</h1>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsEditing(!isEditing)}>Edit</Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex items-center gap-6 text-sm text-gray-500 border-y py-4">
        <div>{resource.estimatedMinutes} mins</div>
        <div>
          Added{" "}
          {format(
            new Date(resource.createdAt ?? new Date().toISOString()),
            "MMM d, yyyy",
          )}
        </div>
      </div>

      {/* Resource Description */}
      <Card>
        <p className="whitespace-pre-wrap leading-relaxed">
          {resource.description}
        </p>
        {resource.tags && resource.tags.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

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
