import React, { createContext, useContext, useReducer } from "react";

// Initial state for the app
const initialState = {
  user: null,
  isAuthenticated: false,
  userRole: null, // 'admin', 'driver', 'customer'
  loading: false,
  error: null,
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        userRole: action.payload.role,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        userRole: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Auth functions (to be implemented with backend)
  const login = async (credentials, role) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // TODO: Replace with actual API call
      // Simulating API call for now
      setTimeout(() => {
        const mockUser = {
          id: "1",
          name: "Test User",
          email: credentials.email,
          role: role,
        };

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: mockUser, role: role },
        });
      }, 1000);
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
    }
  };

  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
