import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPen, FaStar, FaMapMarkerAlt, FaGraduationCap, FaLanguage, FaClock } from 'react-icons/fa';
import axios from 'axios';
import './DoctorProfileView.css'; // We will create this next

const DoctorProfileView = () => {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctor/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctor(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        // If error (no profile), redirect to setup
        navigate('/doctor-profile-setup');
      }
    };
    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="loading-view">Loading Profile...</div>;

  return (
    <div className="profile-view-container">
      
      {/* HEADER */}
      <div className="view-header">
        <button className="back-btn-circle" onClick={() => navigate('/doctor-dashboard')}>
          <FaArrowLeft />
        </button>
        <h1>My Profile</h1>
        <button className="edit-action-btn" onClick={() => navigate('/doctor-profile-setup')}>
          <FaPen /> Edit
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="view-card">
        
        {/* Top Section: Image & Name */}
        <div className="view-hero">
          <img 
            src={doctor.personalInfo?.image || "https://randomuser.me/api/portraits/men/32.jpg"} 
            alt="Doctor" 
            className="view-avatar" 
          />
          <div className="view-identity">
            <h2>{doctor.personalInfo?.name} <span className="verified-tick">✔</span></h2>
            <p className="view-specialty">{doctor.personalInfo?.specialty}</p>
            <div className="view-rating">
              <FaStar className="gold-star" /> {doctor.stats?.rating || 4.8} ({doctor.stats?.reviews || 0} Reviews)
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="view-stats-row">
          <div className="v-stat">
            <label>Experience</label>
            <strong>{doctor.personalInfo?.experience || "N/A"}</strong>
          </div>
          <div className="v-stat">
            <label>Patients</label>
            <strong>{doctor.stats?.patientsServed || "0"}</strong>
          </div>
          <div className="v-stat">
            <label>Fee</label>
            <strong>₹{doctor.clinicInfo?.fee || "0"}</strong>
          </div>
        </div>

        {/* Details Section */}
        <div className="view-details">
          <h3>About Doctor</h3>
          <p>{doctor.personalInfo?.about}</p>
          
          <div className="detail-row">
            <FaLanguage className="d-icon" />
            <span>{doctor.personalInfo?.languages?.join(", ")}</span>
          </div>
          <div className="detail-row">
            <FaGraduationCap className="d-icon" />
            <span>{doctor.personalInfo?.education}</span>
          </div>
        </div>

        {/* Clinic Section */}
        <div className="view-details">
          <h3>Clinic Location</h3>
          <div className="clinic-preview-box">
            <FaMapMarkerAlt className="pin-icon-red" />
            <div>
              <h4>{doctor.clinicInfo?.name || "Clinic Name"}</h4>
              <p>{doctor.clinicInfo?.address}</p>
              <div className="time-row">
                <FaClock /> {doctor.clinicInfo?.timings}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorProfileView;