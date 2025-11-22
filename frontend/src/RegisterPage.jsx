import React, { useState } from 'react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const [role, setRole] = useState('mother'); 

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, role };
    console.log("Submitting:", payload);
   
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        
        <div className="auth-header">
          <span className="logo">MamaMindSense</span>
          <h2 className="title">Create your account.</h2>
          <p className="subtitle">Join us to start your journey.</p>
        </div>

        <div className="role-toggle">
          <button
            type="button"
            onClick={() => setRole('mother')}
            className={`toggle-btn ${role === 'mother' ? 'active' : ''}`}
          >
            Mother
          </button>
          <button
            type="button"
            onClick={() => setRole('professional')}
            className={`toggle-btn ${role === 'professional' ? 'active' : ''}`}
          >
            Healthcare Professional
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Sarah Jenkins"
              className="form-input"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="form-input"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              className="form-input"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>
        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or sign up with</span>
        </div>

        <div className="social-login">
          <button className="btn-social">
            <FaGoogle size={20} />
            Google
          </button>
          <button className="btn-social">
            <FaFacebook size={22} />
            Facebook
          </button>
        </div>
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link-highlight">
              Log In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;