import React, { useState } from 'react';

const MOCK_PROGRAMS = [
  { 
    id: 1, 
    name: 'Помощь детям-сиротам', 
    description: 'Программа поддержки детей в детских домах',
    status: 'Активна',
    budget: '500 000 ₽',
    startDate: '01.09.2023'
  },
  { 
    id: 2, 
    name: 'Экологические инициативы', 
    description: 'Проекты по защите окружающей среды',
    status: 'В разработке',
    budget: '250 000 ₽',
    startDate: '15.10.2023'
  },
  { 
    id: 3, 
    name: 'Поддержка пожилых', 
    description: 'Социальная программа для пожилых людей',
    status: 'Планирование',
    budget: '350 000 ₽',
    startDate: '01.01.2024'
  }
];

const ProgramsPage = () => {
  const [programs] = useState(MOCK_PROGRAMS);

  return (
    <div className="admin-page">
      <h1>Социальные программы</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название программы</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Бюджет</th>
            <th>Дата старта</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {programs.map(program => (
            <tr key={program.id}>
              <td>{program.name}</td>
              <td>{program.description}</td>
              <td>{program.status}</td>
              <td>{program.budget}</td>
              <td>{program.startDate}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn btn-edit">Детали</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProgramsPage;
