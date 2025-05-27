import React, { useState } from 'react';

const MOCK_PROJECTS = [
  { 
    id: 1, 
    name: 'Летний лагерь для детей', 
    type: 'Социальная поддержка',
    partners: 'Городская администрация',
    status: 'Активен',
    fundingGoal: '750 000 ₽',
    currentFunding: '450 000 ₽'
  },
  { 
    id: 2, 
    name: 'Реабилитационный центр', 
    type: 'Медицинская помощь',
    partners: 'Областная больница',
    status: 'Сбор средств',
    fundingGoal: '1 500 000 ₽',
    currentFunding: '250 000 ₽'
  },
  { 
    id: 3, 
    name: 'Экологический марафон', 
    type: 'Защита природы',
    partners: 'Экологический фонд',
    status: 'Планирование',
    fundingGoal: '300 000 ₽',
    currentFunding: '50 000 ₽'
  }
];

const ProjectsPage = () => {
  const [projects] = useState(MOCK_PROJECTS);

  return (
    <div className="admin-page">
      <h1>Благотворительные проекты</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Название проекта</th>
            <th>Направление</th>
            <th>Партнеры</th>
            <th>Статус</th>
            <th>Цель финансирования</th>
            <th>Текущий сбор</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.type}</td>
              <td>{project.partners}</td>
              <td>{project.status}</td>
              <td>{project.fundingGoal}</td>
              <td>{project.currentFunding}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn btn-edit">Подробнее</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default ProjectsPage;
