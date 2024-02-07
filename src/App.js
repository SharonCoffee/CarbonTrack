import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import Navbar from './components/navbar';
import Home from './pages/home';
import About from './pages/about';
import Contact from './pages/contact';
import Faq from './pages/faq';
import LoginPage from './pages/login';
import SignupPage from './pages/signup';
import BerRatingForm from './pages/ber';
import GraphQuery from './pages/graphquery';
import ProtectedRoute from './components/protectedRoute';
import './App.css';
import './firebase/firebaseConfig';

function App () {
  return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route
                            path="/ber"
                            element={
                                <ProtectedRoute>
                                    <BerRatingForm />
                                </ProtectedRoute>
                            }
                        />
                        {/* Protected Route for GraphQuery */}
                        <Route
                            path="/graphquery"
                            element={
                                <ProtectedRoute>
                                    <GraphQuery />
                                </ProtectedRoute>
                            }
                        />
                        {/* Add any other routes here */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
  );
}

export default App;
