import React, { useState, useRef, useEffect } from 'react';
import ArticlesList from '../components/ArticlesList';
import MenuRight from '../components/MenuRight';
import Navigation from '../components/Navigation';
import Axios from 'axios';

import { Row, Col, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

const axiosInst = Axios.create({ withCredentials: true });

function Feed() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    axiosInst.get('http://localhost:3001/articles').then((response) => {
      setArticles(response.data);
    });
  };

  return (
    <Container>
      <Row>
        <Col lg="8">
          <ArticlesList articles={articles} />
        </Col>
        <Col lg="4" className="d-none d-lg-block psgfjdgs-0">
          <MenuRight></MenuRight>
        </Col>
      </Row>
    </Container>
  );
}

export default Feed;
