import React, {
  Component
} from 'react';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import AuthPage from './pages/Auth';
import MoviesPage from './pages/Movies';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css'

class App extends Component {
  state = {
    userId: null
  };

  login = (userId) => {
    this.setState({ userId: userId });
  };

  logout = () => {
    this.setState({ userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
              value={{
                userId: this.state.userId,
                login: this.login,
                logout: this.logout
              }}
            >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {this.state.userId && <Redirect from="/" to="/movies" exact />}
                {this.state.userId && <Redirect from="/auth" to="/movies" exact />}
                {!this.state.userId && (
                  <Route path="/auth" component={AuthPage} />
                )}
                <Route path="/movies" component={MoviesPage} />
                {!this.state.userId && <Redirect to="/auth" exact />}
              </Switch>
            </main>
            </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;