import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import TypePet from "./pages/typepet/TypePet";
import AdminModel from "./pages/admin/AdminModel";
import Reset_password from './pages/reset_password/Reset_password';

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
        <Route exact path="/">
          {/* <Reset_password /> */}
          {user ? <Home /> : <Login />}
          {/* {user ? <AdminModel /> : <Login />} */}
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/typepet" component={TypePet} />
        <Route path="/dashboard">
          {user && user.statusUser === "ADMIN" ? <AdminModel /> : <Home />}
        </Route>
        <Route path="/register" component={Register} >
          <Register />
        </Route>
        <Route path="/profile/:firstName" component={Profile}>
          {user ? <Profile /> : <Login />}
        </Route>
        <Route path="/reset_password" component={Reset_password} />
      </Switch>
    </Router>
  );
}

export default App;
