import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import TypePet from "./pages/typepet/TypePet";
import Sort_feed from "./pages/sort_feed/sort_feed";
import AdminModel from "./pages/admin/AdminModel";
import Reset_password from "./pages/reset_password/Reset_password";
import TypePetSection from ""

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={user ? Home : Login} />
        <Route path="/login" component={Login} />
        <Route path="/typepet" component={TypePet} />
        <Route
          path="/dashboard"
          component={
            user &&
            (user.statusUser === "ADMIN" || user.statusUser === "ADMINCON")
              ? AdminModel
              : Home
          }
        />
        <Route path="/register" component={Register} />
        <Route path="/profile/:firstName" component={user ? Profile : Login} />
        <Route
          path="/sort/:sort/:typePet"
          component={user ? Sort_feed : Login}
        />
        <Route path="/sort/:sort" component={user ? Sort_feed : Login} />
        <Route path="/reset_password" component={Reset_password} />
      </Switch>
    </Router>
  );
}

export default App;
