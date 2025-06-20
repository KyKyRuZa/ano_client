import React, { useState, useEffect } from 'react';
import '../style/home/staff.css';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';
import staffApi from '../api/staff';
import { Link } from 'react-router-dom';

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffData = await staffApi.getAll();

        // Сортировка по алфавиту
        const sortedStaff = [...staffData].sort((a, b) =>
          a.fullname.localeCompare(b.fullname)
        );

        setStaff(sortedStaff);
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
      <Header />
      ЗАГРУЗКА
      <Footer />
    </>
  );

  if (error) return (
    <>
      <Header />
      <div className="staff-page">
        <h1>Ошибка загрузки данных</h1>
        <p>{error.message}</p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="staff-page">
        <h1>Наша команда</h1>
        <div className="staff-grid">
          {staff.map((member) => (
            <Link to={`/personal/${member.id}`} key={member.id} className="staff-card-link">
              <div className="staff-card">
                <div className="staff-card-content">
                  <h3>{member.fullname}</h3>
                  <p>{member.position}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffPage;