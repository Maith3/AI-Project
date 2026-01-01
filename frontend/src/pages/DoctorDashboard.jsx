import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUserInjured, FaCalendarCheck, FaClock, FaSignOutAlt, 
  FaPhone, FaEnvelope, FaCheck, FaTimes 
} from 'react-icons/fa';
import axios from 'axios';
import './DoctorDashboard.css'; 

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
    const [doctorInfo, setDoctorInfo] = useState({
        name: 'Doctor',
        specialty: 'Health Professional',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        status: 'Available'
    });

    const [stats] = useState({
        totalPatients: 0,
        todayAppointments: 0,
        pendingRequests: 0
    });

    const [myPatients, setMyPatients] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // --- INITIAL FETCH ON LOAD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. USE THE CORRECT API ENDPOINT
        // We check '/api/doctor/me'. If it exists, we get data. If not, it throws an error.
        const res = await axios.get('http://localhost:5000/api/doctor/me', config);
        
        // 2. If successful, it means Profile IS Filled. Load the data.
        const d = res.data;
        setDoctor({
          name: d.personalInfo?.name,
          specialty: d.personalInfo?.specialty,
          image: d.personalInfo?.image || "https://randomuser.me/api/portraits/men/32.jpg",
          experience: d.personalInfo?.experience,
          about: d.personalInfo?.about,
          education: d.personalInfo?.education,
          languages: d.personalInfo?.languages || [],
          fee: d.clinicInfo?.fee,
          location: d.clinicInfo?.address,
          timings: d.clinicInfo?.timings,
          rating: d.stats?.rating || 4.8,
          reviews: d.stats?.reviews || 0,
          patientsServed: d.stats?.patientsServed || 0
        });
        
        // If we have data, we stay on the dashboard
        setLoading(false);

      } catch (err) {
        // 3. IF ERROR IS 400 or 404 -> PROFILE DOES NOT EXIST
        // This is where we redirect them to the Setup Page
        if (err.response && (err.response.status === 400 || err.response.status === 404)) {
          console.log("Profile not found, redirecting to setup...");
          navigate('/doctor-profile-setup');
        } else {
          console.error("Server Error:", err);
          setLoading(false);
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleAccept = (id) => {
    setMyPatients(prev => prev.map(p => p.id === id ? { ...p, status: 'Upcoming' } : p));
  };

  const handleReject = (id) => {
    setMyPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleProfileClick = () => {
  const isProfileFilled = doctor && doctor.specialty; 

  if (isProfileFilled) {
    navigate('/doctor-profile-view');
  } else {
    navigate('/doctor-profile-setup');
  }
};

  return (
    <div className="doc-dashboard-container">
      
      {/* SIDEBAR */}
      <div className="doc-sidebar">
        <div className="doc-profile-section">
            <img src={doctorInfo.image} alt="Doctor" className="doc-profile-img" />
            <h3>{doctorInfo.name}</h3>
            <span className="doc-specialty">{doctorInfo.specialty}</span>
            <div className="doc-status-indicator">
                <span className="doc-status-dot"></span> {doctorInfo.status}
            </div>
        </div>
        
        <nav className="doc-nav">
            {/* Pill Shaped Buttons similar to your Profile UI */}
            <button className="doc-nav-item active"><FaUserInjured /> My Patients</button>
            <button className="doc-nav-item"><FaCalendarCheck /> Schedule</button>
            <button className="doc-nav-item"><FaClock /> Availability</button>
        </nav>

        {/* Unique class 'doc-logout-btn' so it doesn't break Mother Dashboard */}
        <button className="doc-logout-btn" onClick={() => navigate('/')}>
            <FaSignOutAlt /> Logout
        </button>
      </div>

            {/* MAIN CONTENT */}
            <div className="doc-main-content">
                <div className="doc-topbar">
                    <div className="doc-brand">
                        <span className="doc-brand-name">मातृCare</span>
                        <span className="doc-brand-sub">Doctor Portal</span>
                    </div>
                    <div className="doc-top-actions">
                        <button className="doc-chip secondary" onClick={handleProfileClick}> Profile</button>
                        <button className="doc-chip primary">Notifications</button>
                    </div>
                </div>

                <div className="doc-header">
                        <h1>Welcome back, {doctorInfo.name} 👋</h1>
                        <p>Here is your daily activity summary.</p>
                </div>

        {/* STATS */}
        <div className="doc-stats-grid">
            <div className="doc-stat-card">
                <div className="doc-stat-icon pink"><FaUserInjured /></div>
                <div className="doc-stat-info">
                    <h3>{stats.totalPatients}</h3>
                    <p>Total Patients</p>
                </div>
            </div>
            <div className="doc-stat-card">
                <div className="doc-stat-icon blue"><FaCalendarCheck /></div>
                <div className="doc-stat-info">
                    <h3>{stats.todayAppointments}</h3>
                    <p>Today's Appointments</p>
                </div>
            </div>
            <div className="doc-stat-card">
                <div className="doc-stat-icon orange"><FaClock /></div>
                <div className="doc-stat-info">
                    <h3>{stats.pendingRequests}</h3>
                    <p>Pending Requests</p>
                </div>
            </div>
        </div>

        {/* APPOINTMENTS LIST */}
        <div className="doc-section-container">
            <h2>Upcoming Appointments</h2>
            <div className="doc-patients-list">
                {loadingProfile ? (
                  <p className="doc-no-data">Loading your schedule...</p>
                ) : myPatients.length > 0 ? (
                    myPatients.map((patient) => (
                        <div key={patient.id} className="doc-patient-card">
                            <div className="doc-patient-info">
                                <h4>{patient.name}</h4>
                                <p>{patient.issue} • Age: {patient.age}</p>
                                <span className="doc-time-badge">{patient.time}</span>
                            </div>
                            
                            <div className="doc-patient-actions">
                                {patient.status === 'Pending' ? (
                                    <>
                                        <button className="doc-action-btn accept" onClick={() => handleAccept(patient.id)}>
                                            <FaCheck /> Accept
                                        </button>
                                        <button className="doc-action-btn reject" onClick={() => handleReject(patient.id)}>
                                            <FaTimes /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className="doc-contact-options">
                                        <button className="doc-icon-btn"><FaPhone /></button>
                                        <button className="doc-icon-btn"><FaEnvelope /></button>
                                        <span className={`doc-status-tag ${patient.status.toLowerCase()}`}>
                                            {patient.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="doc-no-data">No appointments yet. Once patients book with you, they will appear here.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;