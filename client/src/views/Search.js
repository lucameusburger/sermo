import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import Navigation from '../components/Navigation';
import { Row, Col, Button, Modal, Form, Container, FormGroup, FormControl } from 'react-bootstrap';

import SearchResults from '../components/SearchResults';

const axiosInst = Axios.create({ withCredentials: true });

function Search(match) {
  const searchParam = match.location.search.substring(3, match.location.search.length);
  const searchRef = useRef();
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchActive, setSearchActive] = useState([]);

  useEffect(() => {
    handleSearch();
  }, []);

  function handleSearch(e) {
    const search = searchRef.current.value;

    if (search === '') {
      setSearchActive(false);
      return;
    } else {
      setSearchActive(true);
    }

    window.history.replaceState(null, 'New Page Title', '/search?s=' + search);

    axiosInst
      .get('http://localhost:3001/search', { params: { s: search } })
      .then(function (response) {
        // handle success

        if (response.data.success) {
          setArticles(response.data.articles);
          setComments(response.data.comments);
          setUsers(response.data.users);
        } else {
          console.log('failed');
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
        console.log('always');
      });
  }

  return (
    <>
      <Container>
        <h1>Search</h1>
        <Row>
          <Col sm="8" md="10">
            <FormGroup controlId="formGroupSearch" className="my-2">
              <FormControl type="text" placeholder="Search for something" onChange={handleSearch} ref={searchRef} name="content" defaultValue={searchParam} required />
            </FormGroup>
          </Col>
          <Col sm="4" md="2">
            <Button type="button" onClick={handleSearch} variant="dark" className="my-2 w-100">
              Search
            </Button>
          </Col>
        </Row>
        <SearchResults articles={articles} comments={comments} users={users} active={searchActive} />
      </Container>
    </>
  );
}

export default Search;
