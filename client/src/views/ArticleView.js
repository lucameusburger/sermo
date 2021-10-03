import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import Navigation from '../components/Navigation';
import Article from '../components/Article';
import AddComment from '../components/AddComment';
import CommentsList from '../components/CommentsList';
import { Row, Col, Button, FormLabel, FormText, Container, Modal, Form, Control, Feedback } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faFeatherAlt, faCogs, faSearch } from '@fortawesome/free-solid-svg-icons';

const axiosInst = Axios.create({ withCredentials: true });

function ArticleView({ match }) {
  const [article, setArticle] = useState([]);
  const [comments, setComments] = useState([]);
  const [updateComments, setUpdateComments] = useState(false);

  useEffect(() => {
    fetchArticle();
    fetchComments();
    setUpdateComments(false);
  }, [updateComments]);

  const fetchArticle = async () => {
    axiosInst.get(`http://localhost:3001/articles/${match.params.id}`).then((response) => {
      setArticle(response.data);
    });
  };

  const fetchComments = async () => {
    axiosInst.get(`http://localhost:3001/comments`, { params: { article: match.params.id } }).then((response) => {
      setComments(response.data);
    });
  };

  return (
    <div>
      <Article key={article._id} article={article} mode="lg" updater={setUpdateComments} />
      <FormLabel>Comments</FormLabel>
      <AddComment article={article} updater={setUpdateComments} />
      <CommentsList comments={comments} />
    </div>
  );
}

export default ArticleView;
