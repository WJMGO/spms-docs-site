
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TRPCProvider } from "./components/TRPCProvider";
import Dashboard from "./pages/Dashboard";
import ManagementDashboard from "./pages/ManagementDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import ReportsPage from "./pages/ReportsPage";
import TestPage from "./pages/TestPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import PermissionsPage from "./pages/PermissionsPage";
import EmployeeManagement from "./pages/EmployeeManagement";
import PerformanceRegistration from "./pages/PerformanceRegistration";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Dashboard} />
      <Route path={"/management"} component={ManagementDashboard} />
      <Route path={"/analytics"} component={AnalyticsPage} />
      <Route path={"/reports"} component={ReportsPage} />
      <Route path={"/employees"} component={EmployeeManagement} />
      <Route path={"/performance-registration"} component={PerformanceRegistration} />
      <Route path={"/audit-logs"} component={AuditLogsPage} />
      <Route path={"/permissions"} component={PermissionsPage} />
      <Route path={"/test"} component={TestPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <TRPCProvider>
            <Router />
          </TRPCProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
