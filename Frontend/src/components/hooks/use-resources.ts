import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import type { Resource } from "../../redux/resourcesSlice";
import type {
  InsertResource,
  RecommendationRequest,
  RecommendationResponse,
} from "../../types/types";

const API_BASE_URL = "http://localhost:9000/api/v1";

export interface ResourceFilters {
  search?: string;
  resourceType?: string;
  difficulty?: string;
  tags?: string | string[]; // frontend-friendly
}

/* ---------- utils ---------- */
function buildUrl(path: string, params?: Record<string, any>) {
  if (!params) return path;

  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : String(v)]),
  ).toString();

  return `${path}?${query}`;
}
/* ---------- queries ---------- */
export function useResources(filters?: ResourceFilters) {
  const url = buildUrl(`${API_BASE_URL}/getAllResources`, filters);

  return useQuery<Resource[], Error>({
    queryKey: ["resources", filters],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch resources");
      return res.json();
    },
  });
}
export function useResource(id: number) {
  return useQuery<Resource | null, Error>({
    queryKey: ["resource", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/getResourcesById/${id}`, {
        credentials: "include",
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch resource");

      return res.json();
    },
    enabled: !!id,
  });
}

/* ---------- mutations ---------- */
export function useCreateResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Resource, Error, InsertResource>({
    mutationFn: async (data) => {
      const res = await fetch(`${API_BASE_URL}/createResource`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Success", description: "Resource created successfully" });
    },
    onError: (err) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Resource, Error, Partial<InsertResource> & { id: number }>(
    {
      mutationFn: async ({ id, ...updates }) => {
        const res = await fetch(`${API_BASE_URL}/updateResource/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to update resource");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["resources"] });
        toast({
          title: "Success",
          description: "Resource updated successfully",
        });
      },
    },
  );
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE_URL}/deleteResource/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete resource");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Deleted", description: "Resource deleted successfully" });
    },
  });
}

/* ---------- AI recommendation ---------- */
export function useAIRecommend() {
  return useMutation<RecommendationResponse, Error, RecommendationRequest>({
    mutationFn: async (data) => {
      const res = await fetch(`${API_BASE_URL}/recommend-path`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to generate recommendation");
      return res.json();
    },
  });
}
