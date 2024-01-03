import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar'; // Ensure this path is correct
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import home from './pages/home';
import about from './pages/about';
import contact from './pages/contact';

function App () {
  return (
      <Router>
        <div className="App">
          <Navbar />  {/* Navbar component inserted here */}
          <Switch>
            <Route path="/" exact component={home} />
            <Route path="/about" component={about} />
            <Route path="/contact" component={contact} />
          </Switch>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </Router>
  );
}

export default App;
