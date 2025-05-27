import React, { useState } from 'react';

const MOCK_STAFF = [
  { 
    id: 1, 
    name: 'Елена Волкова', 
    position: 'Координатор волонтеров', 
    department: 'Социальные программы',
    contacts: '+7 (999) 123-45-67',
    email: 'elena.volkova@charity.org'
  },
  { 
    id: 2, 
    name: 'Артем Николаев', 
    position: 'Руководитель проектов', 
    department: 'Развитие',
    contacts: '+7 (988) 234-56-78',
    email: 'artem.nikolaev@charity.org'
  },
  { 
    id: 3, 
    name: 'Мария Петрова', 
    position: 'Специалист по fundraising', 
    department: 'Фандрайзинг',
    contacts: '+7 (977) 345-67-89',
    email: 'maria.petrova@charity.org'
  }
];

const StaffPage = () => {
  const [staff] = useState(MOCK_STAFF);

  return (
    <div className="admin-page">
      <h1>Команда организации</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Отдел</th>
            <th>Контакты</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {staff.map(employee => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>{employee.department}</td>
              <td>
                {employee.contacts}<br />
                {employee.email}
              </td>
              <td>
                <div className="action-buttons">
                  <button className="btn btn-edit">Профиль</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default StaffPage;
