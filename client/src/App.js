import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import PrivateRoute from "./component/common/PrivateRoute";
import Navbar from "./component/layout/Navbar";
import Footer from "./component/layout/Footer";
import Landing from "./component/layout/Layout";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import Dashboard from "./component/dashboard/Dashboard";
import CreateProfile from "./component/create-profile/CreateProfile";
import EditProfile from "./component/edit-profile/EditProfile";
import AddExperience from "./component/add-credential/AddExperience";
import AddEducation from "./component/add-credential/AddEducation";
import Profiles from "./component/profiles/Profiles";
import Profile from "./component/profile/Profile";
import NotFound from "./component/not-found/NotFound";
import Posts from "./component/posts/Posts";
import Post from "./component/post/Post";

import store from "./store";

import setAuthToken from "./utils/setAuthToken";

import "./App.css";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

//check for token
if (localStorage.jwtToken) {
  //set auth token header auth token
  setAuthToken(localStorage.jwtToken);
  //decode token and user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  //check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //logOut user
    store.dispatch(logoutUser());
    //Todo : clear current profile
    store.dispatch(clearCurrentProfile());
    //redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
            <Route exact path="/profiles" component={Profiles} />
            <Route exact path="/profile/:handle" component={Profile} />
            <Route exact path="/not-found" component={NotFound} />
            <Switch>
              <PrivateRoute exact path="/feed" component={Posts} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/post/:id" component={Post} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
