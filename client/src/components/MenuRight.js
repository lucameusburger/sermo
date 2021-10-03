import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { Row, Col, Form, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import ArticlesList from '../components/ArticlesList';

const axiosInst = Axios.create({ withCredentials: true });

export default function MenuRight({}) {
  const history = useHistory();
  const menuRightSearchRef = useRef();

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    axiosInst.get('http://localhost:3001/articles/top').then((response) => {
      setArticles(response.data);
    });
  };

  function handleSearch(e) {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      submitSearch();
    }
  }
  function submitSearch() {
    history.push('/search?s=' + menuRightSearchRef.current.value);
  }

  return (
    <div>
      <Card className="mb-3">
        <Card.Body className="p-2">
          <Form onKeyDown={handleSearch} onSubmit={submitSearch}>
            <Row>
              <Col md="8" xxl="10">
                <Form.Control className="border-0 py-2" required type="text" placeholder="Search" ref={menuRightSearchRef} />
              </Col>
              <Col md="4" xxl="2">
                <Button variant="dark" className="w-100" type="submit">
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <h3 className="fs-5">Trending</h3>
      <ArticlesList articles={articles} mode="side" />
    </div>
  );
}
