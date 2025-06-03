import React from 'react';
import MessageList from "../components/MessageList";
import "../style/news.css";

function News() {
  return (
    <div className="news-container">
      <h2>Новости и объявления</h2>
      <MessageList/>
    </div>
  );
}

export default News;
