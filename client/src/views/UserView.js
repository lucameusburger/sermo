import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';

import Navigation from '../components/Navigation';
import User from '../components/User';
import ArticlesList from '../components/ArticlesList';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faFeatherAlt, faCogs, faSearch } from '@fortawesome/free-solid-svg-icons';

import { Row, Col, FormLabel, Container } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function UserView({ match }) {
  const [user, setUser] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    axiosInst.get(`http://localhost:3001/${match.params.username}`).then((response) => {
      setUser(response.data);
      console.log(response.data);
      fetchArticles(response.data._id);
    });
  };

  const fetchArticles = async (userId) => {
    axiosInst.get('http://localhost:3001/articles', { params: { user: userId } }).then((response) => {
      setArticles(response.data);
    });
  };

  return (
    <div>
      <Row>
        <Col md="4" lg="3">
          <User user={user} mode="profile" />
        </Col>
        <Col md="8" lg="9">
          <h3 className="fs-5">Articles</h3>
          <ArticlesList articles={articles} mode="profile" editable="true" />
        </Col>
      </Row>
    </div>
  );
}

export default UserView;
