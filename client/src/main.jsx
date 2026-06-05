import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { getGoogleClientId, isGoogleAuthEnabled } from "./utils/googleAuth";
import "./styles.css";

function RootProviders({ children }) {
  if (isGoogleAuthEnabled()) {
    return <GoogleOAuthProvider clientId={getGoogleClientId()}>{children}</GoogleOAuthProvider>;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootProviders>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </RootProviders>
  </React.StrictMode>,
);
