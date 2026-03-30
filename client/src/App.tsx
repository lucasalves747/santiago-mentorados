import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Obrigado from "./pages/Obrigado";
import CartaBoasVindas from "./pages/CartaBoasVindas";
import GuiaMentorado from "./pages/GuiaMentorado";
import DiarioTransformacao from "./pages/DiarioTransformacao";
import Admin from "./pages/Admin";
import HubMentoria from "./pages/HubMentoria";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/obrigado"} component={Obrigado} />
      <Route path={"/carta"} component={CartaBoasVindas} />
      <Route path={"/guia"} component={GuiaMentorado} />
      <Route path={"/diario"} component={DiarioTransformacao} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/mentoria"} component={HubMentoria} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
