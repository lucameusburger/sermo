import React, { useRef, useState, useEffect } from 'react';
import Article from './Article';
import DeleteArticle from '../components/DeleteArticle';

export default function ArticlesList({ articles = [], mode = 'md', editable = false }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleDeleteModal, setArticleDeleteModal] = useState('');

  const setShowModal = (show) => {
    setShowDeleteModal(show);
  };

  if (!articles.length) {
    return 'No articles found';
  }

  const returnArticles = () => {
    return articles.map((article) => {
      return <Article key={article._id} article={article} setModalArticle={setArticleDeleteModal} showModal={setShowModal} mode={mode} editable />;
    });
  };

  const returnDeleteArticle = () => {
    if (editable) {
      return <DeleteArticle article={articleDeleteModal} show={showDeleteModal} showModal={setShowModal} />;
    }
  };

  return (
    <div>
      {returnDeleteArticle()}
      {returnArticles()}
    </div>
  );
}
