import { ToastContainer, toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import app from "../firebase/Firebase"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import "react-toastify/dist/ReactToastify.css";

function Login({ setIsAuthenticated }) {
  const nav = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    let email = localStorage.getItem("email");
    let isLoggedIn = localStorage.getItem("isLoggedIn");
    if (email && isLoggedIn === "true") {
      setIsAuthenticated(true);
      nav("/dashboard");
    }
  }, [nav, setIsAuthenticated]);

  const rEmail = useRef();
  const rPass = useRef();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  const hEmail = (event) => setEmail(event.target.value);
  const hPass = (event) => setPass(event.target.value);

  const save = (event) => {
    event.preventDefault();

    if (email === "") {
      toast.error("Email should not be empty", { autoClose: 1000 });
      setMsg("");
      rEmail.current.focus();
      return;
    }

    if (pass === "") {
      toast.error("Password should not be empty", { autoClose: 1000 });
      setMsg("");
      rPass.current.focus();
      return;
    }

    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, pass)
      .then((res) => {
        // Store user data in database
        let url = "http://localhost:9000/login";
        let data = { uid: res.user.uid, email: email };

        axios.post(url, data)
          .then((dbRes) => {
            console.log("User data stored in database:", dbRes.data);
            localStorage.setItem("email", email);
            localStorage.setItem("uid", res.user.uid);
            localStorage.setItem("isLoggedIn", "true");
            setIsAuthenticated(true);
            toast.success("Login successful!", { autoClose: 1000 });
            nav("/dashboard");
          })
          .catch((err) => {
            console.error("Database error:", err);
            // Still allow login even if database fails
            localStorage.setItem("email", email);
            localStorage.setItem("uid", res.user.uid);
            localStorage.setItem("isLoggedIn", "true");
            setIsAuthenticated(true);
            toast.success("Login successful!", { autoClose: 1000 });
            nav("/dashboard");
          });
      })
      .catch((err) => {
        setMsg("Issue: " + err.message);
        toast.error("Login failed. Please check your credentials.", { autoClose: 2000 });
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">सरकारी सहायक</h1>
            <h2 className="auth-subtitle">SarkariSahayak Login</h2>
            <p className="auth-description">Access your government services account</p>
          </div>
          
          <form onSubmit={save} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                ref={rEmail}
                onChange={hEmail}
                value={email}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                ref={rPass}
                onChange={hPass}
                value={pass}
                className="form-input"
              />
            </div>
            
            <button type="submit" className="auth-button">
              Login to Account
            </button>
          </form>
          
          {msg && <div className="error-message">{msg}</div>}
          
          <div className="auth-footer">
            <p>New user? <Link to="/signup" className="auth-link">Sign up first</Link></p>
            <p style={{ marginTop: '15px' }}>
              <Link to="/roleselect" className="auth-link">← Back to Role Selection</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
