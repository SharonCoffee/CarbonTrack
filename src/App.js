import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import './App.css';

function App () {
  return (
        <Router>
            <div className="App">
                <Navbar />
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/faq" component={Faq} />
                </Switch>
            </div>
        </Router>
  );
}

export default App;
