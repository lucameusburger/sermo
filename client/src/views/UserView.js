import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';

import Navigation from '../components/Navigation';
import User from '../components/User';
import ArticlesList from '../components/ArticlesList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faFeatherAlt, faCogs, faSearch } from '@fortawesome/free-solid-svg-icons';

import { FormLabel, Container } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function UserView({ match }) {
  const [user, setUser] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchArticles();
  }, []);

  const fetchUser = async () => {
    axiosInst.get(`http://localhost:3001/users/${match.params.id}`).then((response) => {
      setUser(response.data);
    });
  };

  const fetchArticles = async () => {
    axiosInst.get('http://localhost:3001/articles', { params: { user: match.params.id } }).then((response) => {
      setArticles(response.data);
    });
  };

  return (
    <>
      <Container>
        <User user={user} />
        <FormLabel>Articles</FormLabel>
        <ArticlesList articles={articles} mode="smpost" />
      </Container>
    </>
  );
}

export default UserView;
