import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Pay from "./pages/pay";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import PaymentSuccess from "./pages/payment-success";
import OnBoard from "./pages/on-board";
import ApiPaymentGateway from "./pages/api-payment-gateway";
import NotFound from "./pages/not-found";
import { Toaster } from "@/components/ui/toaster";
import PrivateRoute from "@/components/dashboard/protected-route";
import Kyc from "@/pages/kyc";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboard" element={<OnBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/kyc" element={<Kyc />} />
          </Route>
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
