import React from 'react';
import '../style/staff.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const staffData = [
  { id: 1, name: 'Иван Иванов', position: 'Frontend разработчик', department: 'IT' },
  { id: 2, name: 'Мария Петрова', position: 'HR-менеджер', department: 'HR' },
  { id: 3, name: 'Алексей Смирнов', position: 'Дизайнер', department: 'Дизайн' },
  { id: 4, name: 'Ольга Кузнецова', position: 'Менеджер проектов', department: 'Управление' },
];

const StaffPage = () => {
  return (
    <>
    <Header/>
      <div className="staff-page">
        <h1>Сотрудники</h1>
        <table className="staff-table">
          <thead>
            <tr>
              <th>Имя</th>
              <th>Должность</th>
              <th>Отдел</th>
            </tr>
          </thead>
          <tbody>
            {staffData.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.position}</td>
                <td>{member.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    <Footer/>
    </>
  );
};

export default StaffPage;