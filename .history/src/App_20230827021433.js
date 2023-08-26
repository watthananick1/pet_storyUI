import Home from "./pages/home/Home";
import HomeMain from "./pages/homeMain/homeMain";
import homePost from "./pages/homePost/homePost";
import Login from "./pages/login/Login";
import LoginBlog from "./pages/loginBlog/LoginBlog";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import TypePet from "./pages/typepet/TypePet";
import Sort_feed from "./pages/sort_feed/sort_feed";
import AdminModel from "./pages/admin/AdminModel";
import AdminModeladminContent from "./pages/adminContent/adminModeladminContent";
import Reset_password from "./pages/reset_password/Reset_password";
import Setting_page from "./pages/setting/Setting_page"

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
        <Route exact path="/" component={user ? Home : HomeMain} />
        <Route path="/login" component={user ? Home : Login} />
        <Route path="/loginBlog" component={LoginBlog} />
        <Route path="/typepet" component={user ? TypePet : Login} />
        <Route
          path="/dashboard/:section"
          component={
            user &&
            (user.statusUser === "ADMIN")
              ? AdminModel
              : Home
          }
        />
        <Route
          path="/dashboardContent/:section"
          component={
            user &&
            (user.statusUser === "ADMINCON")
              ? AdminModeladminContent
              : Home
          }
        />
        <Route path="/setting/:tab" component={user ? Setting_page : Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile/:firstName" component={user ? Profile : Login} />
        <Route path="/Search/:post" component={user ? homePost : Login} />
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
