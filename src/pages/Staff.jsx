import React, { useState, useEffect } from 'react';
import '../style/staff.css';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';
import staffApi from '../api/staff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await staffApi.getAll();
        setStaff(staffData);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  if (loading) return (
    <>
      <Header/>
      <div className="staff-page">
        <h1>Загрузка...</h1>
      </div>
      <Footer/>
    </>
  );

  if (error) return (
    <>
      <Header/>
      <div className="staff-page">
        <h1>Ошибка загрузки данных</h1>
        <p>{error.message}</p>
      </div>
      <Footer/>
    </>
  );

  return (
    <>
      <Header/>
      <div className="staff-page">
        <h1>Наша команда</h1>
        <div className="staff-grid">
          {staff.map((member) => (
            <div key={member.id} className="staff-card">
              <div className="staff-card-avatar">
                {member.media ? (
                  <img 
                    src={`https://anotsenimzhizn.ru/${member.media}`} 
                    alt={member.fullname} 
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="default-avatar" />
                )}
              </div>
              <div className="staff-card-content">
                <h3>{member.fullname}</h3>
                <p className="staff-position">{member.position}</p>
                <p className="staff-department">
                  {member.callsign || 'Отдел не указан'}
                </p>
                {member.description && (
                  <div className="staff-description">
                    <p>{member.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default StaffPage;