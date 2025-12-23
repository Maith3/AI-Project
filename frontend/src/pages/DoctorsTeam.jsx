import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaCheckCircle, FaUserMd, FaArrowLeft } from 'react-icons/fa';
import './DoctorsTeam.css';

const DoctorsTeam = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Gynecologist', 'Therapist'

  // SIMULATE FETCHING REAL DOCTORS
  // In the future, replace this URL with: "http://localhost:5000/api/users/doctors"
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Fetching random users to simulate a real directory
        const response = await fetch('https://randomuser.me/api/?results=8&nat=in');
        const data = await response.json();

        // Transforming data to match your requirements
        const realTimeDoctors = data.results.map((user, index) => ({
          id: index,
          name: `Dr. ${user.name.first} ${user.name.last}`,
          // Randomly assigning specialties for demo
          specialty: index % 2 === 0 ? 'Gynecologist' : 'Therapist',
          email: user.email,
          phone: user.phone,
          image: user.picture.large,
          // Randomly assigning "Maatrucare Verified" status
          isVerified: Math.random() > 0.3, 
          location: `${user.location.city}, ${user.location.state}`
        }));

        setDoctors(realTimeDoctors);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter Logic
  const filteredDoctors = activeTab === 'All' 
    ? doctors 
    : doctors.filter(doc => doc.specialty === activeTab);

  return (
    <div className="doctors-page-container">
      {/* HEADER - Matches Profile Page Style */}
      <div className="dashboard-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h1>Our Medical Experts</h1>
        <div className="header-placeholder"></div> {/* Balances the back button */}
      </div>

      <div className="doctors-content">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={activeTab === 'All' ? 'active' : ''} 
            onClick={() => setActiveTab('All')}
          >
            All Experts
          </button>
          <button 
            className={activeTab === 'Gynecologist' ? 'active' : ''} 
            onClick={() => setActiveTab('Gynecologist')}
          >
            Gynecologists
          </button>
          <button 
            className={activeTab === 'Therapist' ? 'active' : ''} 
            onClick={() => setActiveTab('Therapist')}
          >
            Therapists
          </button>
        </div>

        {/* Loading State */}
        {loading && <div className="loading-spinner">Finding best doctors...</div>}

        {/* Doctors Grid */}
        <div className="doctors-grid">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              
              {/* Verified Badge */}
              <div className={`verified-badge ${doctor.isVerified ? 'verified' : 'unverified'}`}>
                {doctor.isVerified ? (
                  <> <FaCheckCircle /> Maatrucare Verified </>
                ) : (
                  <> Not Verified </>
                )}
              </div>

              <div className="doctor-image-wrapper">
                <img src={doctor.image} alt={doctor.name} className="doctor-img" />
              </div>

              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <span className="specialty-tag">{doctor.specialty}</span>
                <p className="location-text">{doctor.location}</p>
                
                <div className="action-buttons">
                  <a href={`tel:${doctor.phone}`} className="contact-btn call">
                    <FaPhoneAlt /> Call
                  </a>
                  <a href={`mailto:${doctor.email}`} className="contact-btn email">
                    <FaEnvelope /> Email
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsTeam;