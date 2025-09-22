
import NavBarPrivate from "../components/NavBarPrivate";
import { ToastContainer, toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import app from "../firebase/Firebase";
import { getAuth, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../styles/changePassword.css";

function ChangePassword() {
  const nav = useNavigate();
  const auth = getAuth(app);

  useEffect(() => {
    if (!localStorage.getItem("email")) {
      nav("/login");
    }
  }, [nav]);

  const rPass1 = useRef();
  const rPass2 = useRef();
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");

  const hPass1 = (e) => setPass1(e.target.value);
  const hPass2 = (e) => setPass2(e.target.value);

  const save = (e) => {
    e.preventDefault();

    if (pass1 === "") {
      toast.error("Password should not be empty", { autoClose: 1000 });
      setMsg("");
      rPass1.current.focus();
      return;
    }
    if (pass2 === "") {
      toast.error("Password should not be empty", { autoClose: 1000 });
      setMsg("");
      rPass2.current.focus();
      return;
    }

    if (pass1 !== pass2) {
      setMsg("Passwords did not match");
      setPass1("");
      setPass2("");
      rPass1.current.focus();
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      toast.error("No user is currently logged in", { autoClose: 1000 });
      return;
    }

    updatePassword(user, pass1)
      .then(() => {
        toast.success("Password changed successfully! Logging out...", { autoClose: 1500 });
        // Remove user data from localStorage
        localStorage.removeItem("email");

        // Sign out from Firebase
        auth.signOut().then(() => {
          nav("/login"); // redirect to login page
        });
      })
      .catch((err) => {
        setMsg("Issue: " + err.message);
      });
  };

  return (
    <>
      <NavBarPrivate />
      <ToastContainer />
      <div className="change-password-wrapper">
        <div className="change-password-card">
          <h2 className="change-password-title">Change Password</h2>
          <form onSubmit={save} className="change-password-form">
            <input
              type="password"
              placeholder="Enter new password"
              ref={rPass1}
              value={pass1}
              onChange={hPass1}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              ref={rPass2}
              value={pass2}
              onChange={hPass2}
              className="input-field"
            />
            <button type="submit" className="submit-btn">
              Change Password
            </button>
          </form>
          {msg && <p className="error-msg">{msg}</p>}
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
