import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./store/auth.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StrictMode>
      <App />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#374151",
            color: "#fff",
            padding: "12px 20px",
            fontSize: "14px",
            maxWidth: "500px",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          },
          success: {
            style: {
              background: "linear-gradient(90deg, #16a34a, #16a34a)",
              color: "white",
              borderRadius: "12px",
            },
          },
          error: {
            style: {
              background: "linear-gradient(90deg, #ef4444, #dc2626)",
              color: "white",
              borderRadius: "12px",
            },
          },
          info: {
            style: {
              background: "linear-gradient(90deg, #3b82f6, #2563eb)",
              color: "white",
              borderRadius: "12px",
            },
          },
        }}
      />
    </StrictMode>
  </AuthProvider>
);
