import { useAuth } from "../context/AuthContext";

function LoginModal() {
  const { showLogin, closeLogin } = useAuth();

  if (!showLogin) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Login</h2>
        <button onClick={closeLogin}>Close</button>
      </div>
    </div>
  );
}

export default LoginModal;