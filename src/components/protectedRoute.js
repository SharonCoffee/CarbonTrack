import React from 'react';
import PropTypes from 'prop-types';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = ({ children, ...rest }) => {
  const { currentUser } = useAuth();

  return (
        <Route
            {...rest}
            render={({ location }) =>
              currentUser
                ? (
                    children
                  )
                : (
                    <Navigate
                        to={{
                          pathname: '/login',
                          state: { from: location }
                        }}
                    />
                  )
            }
        />
  );
};

// Add prop types validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
