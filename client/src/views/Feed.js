import React, { useState, useEffect } from 'react';
import ArticlesList from '../components/ArticlesList';
import MenuRight from '../components/MenuRight';
import AddArticle from '../components/AddArticle';
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
      console.log(response);
      setArticles(response.data);
    });
  };

  return (
    <div>
      <h1 className="fs-5">Feed</h1>
      <Row>
        <Col className="" lg="8">
          <AddArticle />
          <ArticlesList articles={articles} editable="true" />
        </Col>
        <Col lg="4" className="d-none d-lg-block ps-0">
          <MenuRight></MenuRight>
        </Col>
      </Row>
    </div>
  );
}

export default Feed;
