import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import type {
  InsertResource,
  RecommendationRequest,
  RecommendationResponse,
  Resource,
} from "../../types/types";
import { buildUrl } from "../../utils/utils";

const API_BASE_URL = "http://localhost:9000/api";

export interface ResourceFilters {
  q?: string;
  resourceType?: string;
  difficulty?: string;
  tag?: string;
}

/* ---------- queries ---------- */
export function useResources(filters?: ResourceFilters) {
  const url = buildUrl(`${API_BASE_URL}/resources`, filters);

  return useQuery<Resource[], Error>({
    queryKey: ["resources", filters],
    queryFn: async () => {
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch resources");
      const json = await res.json();
      return Array.isArray(json.items) ? json.items : [];
    },
  });
}

export function useResource(id: string | undefined) {
  return useQuery<Resource | null, Error>({
    queryKey: ["resource", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
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
      const res = await fetch(`${API_BASE_URL}/resources`, {
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

  return useMutation<Resource, Error, Partial<InsertResource> & { id: string }>(
    {
      mutationFn: async ({ id, ...updates }) => {
        const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
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

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
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
      const res = await fetch(`${API_BASE_URL}/ai/recommend-path`, {
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
