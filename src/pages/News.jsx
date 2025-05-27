import React from 'react';
import MessageList from "../components/MessageList";
import "../style/news.css";

function News() {
  return (
    <div className="news-container">
      <MessageList/>
    </div>
  );
}

export default News;
