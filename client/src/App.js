import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import Landing from "./layouts/Landing";
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client"

const endPoint = "http://localhost:5000/graphql"



function App() {
  const client = new ApolloClient({
    uri: endPoint,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Landing} />
          <Route path='/register' exact component={Register}  />
          <Route path='/login' exact component={Login}  />
        </Switch>
        <Footer />
      </div>
    </Router>
    </ApolloProvider>
  );
}
export default App;
