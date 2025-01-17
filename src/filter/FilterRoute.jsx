import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {UserContext} from "../utils/userContext.jsx";

// eslint-disable-next-line react/prop-types
export const ProtectedRoute = ({ element, requiredRole }) => {
    const { user, isLoading } = useContext(UserContext);

    if (isLoading) {
        // Optionally show a loading spinner or return null until loading completes
        return null;
    }

    if (!user) {
        // Redirect to login if the user is not logged in
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.roleId !== requiredRole) {
        // If user does not have the required role, redirect to the main page
        return <Navigate to="/" />;
    }

    return element;
};
// eslint-disable-next-line react/prop-types
export const PublicRoute = ({ element, redirectTo }) => {
    const { user, isLoading } = useContext(UserContext);

    if (isLoading) {
        return null;
    }

    return user ? <Navigate to={redirectTo} /> : element;
};