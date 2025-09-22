import {ToastContainer,toast} from "react-toastify";
import {useState,useRef,useEffect} from "react";
import app from "../firebase/Firebase"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";
import "react-toastify/dist/ReactToastify.css";

function SignUp()
{
	const nav =useNavigate();
	const rEmail=useRef();
	const rPass1=useRef();
	const rPass2=useRef();

	const[email,setEmail]=useState("");
	const[pass1,setPass1]=useState("");
	const[pass2,setPass2]=useState("");
	const[msg,setMsg]=useState("");

	const hEmail=(event)=>{setEmail(event.target.value);}
	const hPass1=(event)=>{setPass1(event.target.value);}
	const hPass2=(event)=>{setPass2(event.target.value);}

	const save=(event)=>{
		event.preventDefault();
		if(email==="")
		{
			toast.error("Email shud not be empty",{autoClose:1000});
			setMsg("");
			rEmail.current.focus();
			return;
		}
		if(pass1==="")
		{
			toast.error("password shud not be empty",{autoClose:1000});
			setMsg("");
			rPass1.current.focus();
			return;
		}
		if(pass2==="")
		{
			toast.error("Confirm password shud not be empty",{autoClose:1000});
			setMsg("");
			rPass2.current.focus();
			return;
		}
		if (pass1 === pass2) {
		const auth = getAuth(app);
		createUserWithEmailAndPassword(auth, email, pass1)
				.then((res) => {
					// Store user data in database
					let url = "http://localhost:9000/login";
					let data = { uid: res.user.uid, email: email };

					axios.post(url, data)
						.then((dbRes) => {
							console.log("User registered and stored in database:", dbRes.data);
							toast.success("Registration successful!", { autoClose: 2000 });
							nav("/login");
						})
						.catch((err) => {
							console.error("Database error:", err);
							// Still allow registration even if database fails
							toast.success("Registration successful!", { autoClose: 2000 });
							nav("/login");
						});
				})
				.catch((err) => {
					setMsg("Issue: " + err.message);
					toast.error("Registration failed. Please try again.", { autoClose: 2000 });
				});
		} else {
			setMsg("Password did not match");
			setPass1("");
			setPass2("");
			rPass1.current.focus();
		}
	}	

return(
	<>
		<ToastContainer/>
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<h1 className="auth-title">सरकारी सहायक</h1>
					<h2 className="auth-subtitle">SarkariSahayak Registration</h2>
					<p className="auth-description">Join the official government services portal</p>
				</div>
				
				<form onSubmit={save} className="auth-form">
					<div className="form-group">
						<label htmlFor="email">Email Address</label>
						<input 
							type="email" 
							id="email"
							placeholder="Enter your official email" 
							ref={rEmail} 
							onChange={hEmail} 
							value={email}
							className="form-input"
						/>
					</div>
					
					<div className="form-group">
						<label htmlFor="password1">Password</label>
						<input 
							type="password" 
							id="password1"
							placeholder="Create a strong password" 
							ref={rPass1} 
							onChange={hPass1} 
							value={pass1}
							className="form-input"
						/>
					</div>
					
					<div className="form-group">
						<label htmlFor="password2">Confirm Password</label>
						<input 
							type="password" 
							id="password2"
							placeholder="Confirm your password" 
							ref={rPass2} 
							onChange={hPass2} 
							value={pass2}
							className="form-input"
						/>
					</div>
					
					<button type="submit" className="auth-button">
						Register Account
					</button>
				</form>
				
				{msg && <div className="error-message">{msg}</div>}
				
				<div className="auth-footer">
					<p>Already have an account? <Link to="/login" className="auth-link">Login here</Link></p>
				</div>
			</div>
		</div>
	</>
);
}

export default SignUp;