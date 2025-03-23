import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import Forgotpass from "./pages/Forgotpass";
import Create_new_password from "./pages/Create_newpassword";
import Subscription from "./pages/Subscription";
import Services from "./pages/Services";
import Usermanagement from "./pages/Usermanagement";
import Hardware from "./pages/Hardware";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Dashboardcontent from "./pages/Dashboardcontent";
import Add_subscription from "./pages/subscription_pages/Add_subscription";
import Add_resources from "./pages/service_pages/Add_resources";
import Add_customers from "./pages/service_pages/Add_customers";
import Add_hardware from "./pages/Hardware_pages/Add_hardware";
import Add_providers from "./pages/subscription_pages/Add_providers";
import Viewsubscription from "./pages/subscription_pages/Viewsubscription";
import Viewdetails from "./pages/subscription_pages/Viewdetails";
import View_user from "./pages/usermanagement_pages/View_user";
import Recyclebin from "./pages/usermanagement_pages/Recyclebin";
import Changepassword from "./pages/usermanagement_pages/Changepassword";
import Expenditure_report from "./pages/dashboard_componenets/Expenditure_report";
import Serverusage_report from "./pages/dashboard_componenets/Serverusage_report";
import View_hardwareDetails from "./pages/Hardware_pages/View_hardwareDetails";
import View_hardware from "./pages/Hardware_pages/View_hardware";
import View_customers from "./pages/service_pages/View_customers";
import Notifications from "./pages/dashboard_componenets/Notifications";
import View_resources from "./pages/service_pages/View_resources";
import Add_user from "./pages/usermanagement_pages/Add_user";
import View_all_customers from "./pages/service_pages/View_all_customers";
import View_customerdetails from "./pages/service_pages/View_customerdetails";






const AppRouter = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<App />} />
      <Route path="/forgot-password" element={<Forgotpass />} />
      <Route path="/reset-password/:uid/:token" element={<Create_new_password />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>

          <Route index element={<Dashboardcontent />} />
          <Route path="expense_report" element={<Expenditure_report />} />
          <Route path="server_usage" element={<Serverusage_report />} />
          <Route path="notifications" element={<Notifications />} />





          <Route path="subscriptions" element={<Subscription />} >
            <Route path="addsubscription" element={<Add_subscription />} />
            <Route path="addproviders" element={<Add_providers />} />
            <Route path="Viewsubscription" element={<Viewsubscription />} />
            <Route path="Viewdetails" element={<Viewdetails />} />




          </Route>


          <Route path="hardware" element={<Hardware />} >
            <Route path="add_hardware" element={<Add_hardware />} />
            <Route path="view_hardware" element={<View_hardware />} />
            <Route path="view_hardwaredetails" element={<View_hardwareDetails />} />




          </Route>


          <Route path="services" element={<Services />} >
            <Route path="add_resources" element={<Add_resources />} />
            <Route path="add_customers" element={<Add_customers />} />
            <Route path="view_customers" element={<View_customers />} />
            <Route path="view_allcustomers" element={<View_all_customers/>} />
            
            <Route path="View_customerdetails" element={<View_customerdetails/>} />
            <Route path="view_resources" element={<View_resources />} />

          </Route>

          <Route path="users" element={<Usermanagement />} >
            <Route index element={<View_user />} />  {/* Add this index route */}
            <Route path="viewuser" element={<View_user />} />
            <Route path="adduser" element={<Add_user />} />
            <Route path="recyclebin" element={<Recyclebin />} />
            <Route path="changepassword" element={<Changepassword />} />
          </Route>

        </Route>

      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
