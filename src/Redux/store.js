import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./slices/dashboardSlice";
import subscriptionReducer from "./slices/subscriptionSlice"; // Add this line

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer, // Keep the dashboard reducer
    subscriptions: subscriptionReducer, // Add the subscription reducer
  },
});

export default store;
