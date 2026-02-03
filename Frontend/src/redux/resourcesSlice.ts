import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: string;
  resourceType: string;
  difficulty: string;
  estimatedMinutes: number;
  tags: string[];
  createdAt?: string;
}

interface ResourcesState {
  items: Resource[];
  loading: boolean;
  error?: string;
}

const initialState: ResourcesState = {
  items: [],
  loading: false,
};

// Async Thunks
export const fetchResources = createAsyncThunk(
  "resources/fetch",
  async (search: string) => {
    const res = await fetch(`/api/resources?search=${search}`);
    if (!res.ok) throw new Error("Failed to fetch resources");
    return res.json() as Promise<Resource[]>;
  },
);

export const createResource = createAsyncThunk(
  "resources/create",
  async (resource: Omit<Resource, "id">) => {
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resource),
    });
    if (!res.ok) throw new Error("Failed to create resource");
    return res.json() as Promise<Resource>;
  },
);

export const updateResource = createAsyncThunk(
  "resources/update",
  async (resource: Resource) => {
    const res = await fetch(`/api/resources/${resource.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resource),
    });
    if (!res.ok) throw new Error("Failed to update resource");
    return res.json() as Promise<Resource>;
  },
);

export const deleteResource = createAsyncThunk(
  "resources/delete",
  async (id: number) => {
    const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete resource");
    return id;
  },
);

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchResources.fulfilled,
        (state, action: PayloadAction<Resource[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create
      .addCase(
        createResource.fulfilled,
        (state, action: PayloadAction<Resource>) => {
          state.items.push(action.payload);
        },
      )
      // Update
      .addCase(
        updateResource.fulfilled,
        (state, action: PayloadAction<Resource>) => {
          const index = state.items.findIndex(
            (r) => r.id === action.payload.id,
          );
          if (index >= 0) state.items[index] = action.payload;
        },
      )
      // Delete
      .addCase(
        deleteResource.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter((r) => r.id !== action.payload);
        },
      );
  },
});

export default resourcesSlice.reducer;
