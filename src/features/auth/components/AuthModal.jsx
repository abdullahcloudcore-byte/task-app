import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export const AuthModal = ({ isOpen, onClose, initialView = "login" }) => {
  const [view, setView] = useState(initialView);

  return (
    <Modal
      id="laravel-auth-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={view === "login" ? "Laravel Sanctum Sign In" : "Register Laravel Account"}
      subtitle={
        view === "login"
          ? "Authenticate via Bearer token to manage tasks"
          : "Create a new user in the Laravel database"
      }
    >
      {view === "login" ? (
        <LoginForm
          onSuccess={onClose}
          onSwitchToRegister={() => setView("register")}
        />
      ) : (
        <RegisterForm
          onSuccess={onClose}
          onSwitchToLogin={() => setView("login")}
        />
      )}
    </Modal>
  );
};

export default AuthModal;
