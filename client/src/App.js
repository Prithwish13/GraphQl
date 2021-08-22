import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Landing from "./layouts/Landing";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Landing} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}
export default App;
