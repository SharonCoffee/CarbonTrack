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
import ResetPassword from './pages/resetpassword';
import SignupPage from './pages/signup';
import BerPage from './pages/ber';
import Suggestions from './pages/suggestions';
import Dashboard from './pages/dashboard'; // Your generic dashboard component
import PolicyInsightsDashboard from './pages/policyinsights';
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
                        <Route path="/resetpassword" element={<ResetPassword />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/BerRatingForm" element={
                                <ProtectedRoute>
                                    <BerPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/suggestions" element={
                            <ProtectedRoute>
                                <Suggestions />
                            </ProtectedRoute>
                        } />
                        {/* Protected Route for PolicyInsights */}
                        <Route path="/policyinsights" element={
                            <ProtectedRoute>
                                <PolicyInsightsDashboard />
                            </ProtectedRoute>
                        } />
                        {/* Protected Route for Dashboards - dynamic route for every county */}
                        <Route path="/dashboard_:county" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Add additional routes here */}
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
  );
}

export default App;
