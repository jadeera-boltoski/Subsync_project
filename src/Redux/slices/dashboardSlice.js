import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getdashboard_content } from "../../services/allapi";

// Async thunk to fetch dashboard data
export const fetchDashboardData = createAsyncThunk(
    "dashboard/fetchData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getdashboard_content();
            
            console.log("🚀 API Raw Response:", response); // ✅ Check API response
            
            if (!response) {
                throw new Error("No response from API");
            }
            
            // Sometimes, Axios stores data inside `response.data`, but if your API returns data directly, this might be unnecessary.
            const responseData = response.data || response;
            
            if (!responseData || typeof responseData !== "object") {
                throw new Error("Invalid API response structure");
            }
            
            // Return the data directly from the API without transformation
            return responseData;
        } catch (error) {
            console.error("❌ Error fetching dashboard data:", error);
            return rejectWithValue(error.message || "Failed to fetch dashboard data");
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        expired_count: 0,
        hardware_cost: 0,
        maintenance_due: 0,
        renewal_subscriptions: 0,
        total_active_customers: 0,
        total_active_hardware: 0,
        total_active_subscriptions: 0,
        total_hardware: 0,
        total_subscription_cost: 0,
        total_warnings: 0,
        warranty_expiring: 0,
        total_resources:0,
        loading: false,
        error: null,
    },
    reducers: {},
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                // Update all properties from the API response
                state.expired_count = action.payload.expired_count || 0;
                state.hardware_cost = action.payload.hardware_cost || 0;
                state.maintenance_due = action.payload.maintenance_due || 0;
                state.renewal_subscriptions = action.payload.renewal_subscriptions || 0;
                state.total_active_customers = action.payload.total_active_customers || 0;
                state.total_active_hardware = action.payload.total_active_hardware || 0;
                state.total_active_subscriptions = action.payload.total_active_subscriptions || 0;
                state.total_hardware = action.payload.total_hardware || 0;
                state.total_subscription_cost = action.payload.total_subscription_cost || 0;
                state.total_warnings = action.payload.total_warnings || 0;
                state.warranty_expiring = action.payload.warranty_expiring || 0;
                state.total_resources=action.payload.total_resources ||0;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export default dashboardSlice.reducer;