import { Route, Switch } from "wouter";
import MinPage from "./pages/MinPage";

export default function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={MinPage} />
        <Route path="/test" component={() => <div>Test Page Works!</div>} />
      </Switch>
    </div>
  );
}