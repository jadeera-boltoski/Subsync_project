import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getsubscription } from "../../services/allapi";

// Async thunk to fetch subscription data
export const fetchSubscriptionData = createAsyncThunk(
  "subscriptions/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const resultsub = await getsubscription();
      console.log("🚀 API Raw Response:", resultsub); // Check API response

      if (!Array.isArray(resultsub)) {
        throw new Error("Invalid subscription data structure");
      }

      return resultsub; // Return the subscription data as-is
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      return rejectWithValue(error.message || "Failed to fetch subscription data");
    }
  }
);

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionData.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload; // Save the fetched subscription data
      })
      .addCase(fetchSubscriptionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default subscriptionsSlice.reducer;
