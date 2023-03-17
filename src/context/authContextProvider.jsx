import React, { useEffect, useMemo, useState, createContext } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
  isAuthenticated: null,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

export default function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const loadAuthUser = () => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsAuthenticated(true);
    }
  };

  const providerValue = useMemo(() => {
    return {
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
    };
  }, [isAuthenticated, setIsAuthenticated, user, setUser]);

  useEffect(() => {
    loadAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};
