import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { LayoutWrapper } from "../components/common/layout/layout-wrapper.js";
import "@repo/ui/styles/globals.css";
import AppRoutes from "./routes.js";
import ScrollToTop from "@repo/ui/hooks/ScrollToTop.js";
import { Toaster } from "sonner";
import RQuery from "@repo/ui/hooks/RQuery.js";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ScrollToTop />
    <RQuery>
      <Toaster />
      <LayoutWrapper >
        <AppRoutes />
      </LayoutWrapper>
    </RQuery>
  </BrowserRouter>
);
