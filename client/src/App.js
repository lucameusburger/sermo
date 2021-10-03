import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Navigation from './components/Navigation';
import Login from './views/Login';
import Register from './views/Register';
import Feed from './views/Feed';
import Users from './views/Users';
import ArticleView from './views/ArticleView';
import Settings from './views/Settings';
import Search from './views/Search';
import UserView from './views/UserView';
import Axios from 'axios';

import './css/main.css';
import './css/bootstrap-custom.css';

const axiosInst = Axios.create({ withCredentials: true });

function App() {
  const [auth, setAuth] = useState(false);

  axiosInst.post('http://localhost:3001/checkLogged').then(function (response) {
    if (response.data.user) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  });

  return (
    <Router>
      <Navigation />
      <Container fluid="xxl" style={{ marginTop: '.75rem', marginBottom: 'calc(54px + .75rem)' }}>
        <Switch>
          <Route path="/login/" exact component={Login}></Route>
          <Route path="/register/" exact component={Register} />
          <Route path="/settings/" component={Settings} />
          <Route path="/search/" component={Search} />
          <Route path="/articles/" exact component={Feed} />
          <Route path="/articles/:id" component={ArticleView} />
          <Route path="/users/" exact component={Users} />
          <Route path="/:username" component={UserView} />
          <Route path="/" exact component={Feed} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
