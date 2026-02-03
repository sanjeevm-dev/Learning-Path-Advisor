import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  RecommendationRequest,
  RecommendationResponse,
} from "../types/types";

const API_BASE_URL = "http://localhost:9000/api";

// Async thunk for AI recommendation API call
export const fetchAIRecommendation = createAsyncThunk<
  RecommendationResponse, // returned type
  RecommendationRequest, // argument type
  { rejectValue: string }
>("ai/fetchRecommendation", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/recommend-path`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      return rejectWithValue(text || "Failed to generate recommendation");
    }

    const data: RecommendationResponse = await res.json();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Unknown error");
  }
});

interface AIState {
  recommendation: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: AIState = {
  recommendation: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearRecommendation(state) {
      state.recommendation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.recommendation = null;
      })
      .addCase(
        fetchAIRecommendation.fulfilled,
        (state, action: PayloadAction<RecommendationResponse>) => {
          state.loading = false;
          state.recommendation = action.payload;
        },
      )
      .addCase(fetchAIRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch recommendation";
      });
  },
});

export const { clearRecommendation } = aiSlice.actions;
export default aiSlice.reducer;
