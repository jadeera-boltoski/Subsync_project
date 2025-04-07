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

      // Sort subscriptions by start date (newest first)
      const sortedSubscriptions = [...resultsub].sort((a, b) => {
        // If dates are in ISO format (YYYY-MM-DD)
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        
        // If dates are in DD-MM-YYYY format, uncomment below
        /*
        const [dayA, monthA, yearA] = a.start_date.split('-');
        const [dayB, monthB, yearB] = b.start_date.split('-');
        
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        */
        
        return dateB - dateA; // Sort newest first
      });

      console.log("📅 Sorted subscriptions:", sortedSubscriptions);
      return sortedSubscriptions;
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
        state.subscriptions = action.payload; // Now contains sorted subscriptions
      })
      .addCase(fetchSubscriptionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default subscriptionsSlice.reducer;