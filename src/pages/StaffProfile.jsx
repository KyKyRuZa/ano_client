import React, { useState, useEffect } from 'react';
import '../style/home/staffprofile.css';
import Header from '../components/ux/Header';
import Footer from '../components/ux/Footer';
import staffApi from '../api/staff';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const StaffProfilePage = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await staffApi.getOne(id);
        setMember(data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return (<>
            <Header />
                ЗАГРУЗКА
            <Footer />
            </>
  )
  if (!member) return <p>Сотрудник не найден</p>;

  return (
    <>
      <Header />
      <div className="staff-profile">
        <div className="staff-profile-card">
          <div className="staff-profile-avatar">
            {member.media ? (
              <img src={`https://anotsenimzhizn.ru${member.media}`} alt={member.fullname} />
            ) : (
              <FontAwesomeIcon icon={faUser} className="default-avatar" />
            )}
          </div>

          <div className="staff-profile-content" lang="ru">
            <h2>{member.fullname}</h2>
            <p className='staff-profile-position'><strong>Должность:</strong> {member.position}</p>
            <p className='staff-profile-callsign'><strong>Отдел:</strong> {member.callsign || 'Не указан'}</p>
            {member.description && (
              <div className="staff-profile-description">
                <h4>О сотруднике</h4>
                <p>{member.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaffProfilePage;