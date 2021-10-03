import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Navigation from './Navigation';

import { Button, Card, Row, Form, Col } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function AddArticle() {
  const articleContentRef = useRef();

  const [contentCount, setContentCount] = useState(0);
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    setValidated(true);
    handleAddArticle(e);
  };

  function handleAddArticle(e) {
    const content = articleContentRef.current.value;

    axiosInst
      .post('http://localhost:3001/articles/', { content: content })
      .then(function (response) {
        // handle success
        if (response.data.success) {
          articleContentRef.current.value = null;
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function restrictCount(e) {
    let cnt = e.target.value.length;
    if (cnt > 500) {
      cnt = 500;
      articleContentRef.current.value = e.target.value.substring(0, cnt);
    }
    setContentCount(cnt);
  }

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col md="10" xl="10" className="mb-2">
            <Form.Control required required as="textarea" rows="2" max="500" type="text" placeholder="Post article" ref={articleContentRef} onChange={(e) => restrictCount(e)} />
            <Form.Control.Feedback type="invalid">Please write some content.</Form.Control.Feedback>
          </Col>
          <Col md="2" xl="2" className="mb-2">
            <Button variant="dark" className="w-100" type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
            <Form.Text className="text-muted">{contentCount}/500 chars</Form.Text>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddArticle;
