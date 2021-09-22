import React from 'react';
import Article from './Article';

export default function ArticlesList({ articles = [], mode = 'md' }) {
  console.log(articles);
  if (!articles.length) {
    return 'No articles found';
  }
  return articles.map((article) => {
    return <Article key={article._id} article={article} mode={mode} />;
  });
}
