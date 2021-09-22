import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

import Navigation from '../components/Navigation';

import { Button, Container, Modal, Form } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function AddArticle() {
  const articleTitleRef = useRef();
  const articleContentRef = useRef();

  const [contentCount, setContentCount] = useState(0);
  const [validated, setValidated] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalMsg, setModalMsg] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

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
    const title = articleTitleRef.current.value;
    const content = articleContentRef.current.value;

    axiosInst
      .post('http://localhost:3001/articles/', { title: title, content: content })
      .then(function (response) {
        // handle success

        if (response.data.success) {
          articleTitleRef.current.value = null;
          articleContentRef.current.value = null;

          setModalMsg(response.data.msg);
          handleModalShow();
        } else {
          setModalMsg(response.data.msg);
          handleModalShow();
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
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Container>
          <h1>Add article</h1>
          <Form.Group controlId="formGroupTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control required type="text" placeholder="Enter title" ref={articleTitleRef} />
            <Form.Control.Feedback type="invalid">Please choose a title.</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="my-2" controlId="formGroupContent">
            <Form.Label>Content</Form.Label>
            <Form.Control required as="textarea" rows={4} placeholder="Enter content" max="500" ref={articleContentRef} onChange={(e) => restrictCount(e)} />
            <Form.Text className="text-muted">{contentCount}/500 chars left</Form.Text>
            <Form.Control.Feedback type="invalid">Please write some content.</Form.Control.Feedback>
          </Form.Group>
          <Button variant="dark" type="submit">
            Publish
          </Button>{' '}
          <Button variant="outline-dark">Clear</Button>
        </Container>
      </Form>

      <Modal show={modalShow} onHide={handleModalClose} centered>
        <Modal.Body className="text-center bg-dark text-white py-5">
          <h4>Successfully posted</h4>
          <p>
            <small>{modalMsg}</small>
          </p>
          <Link to="/">
            <Button variant="light" onClick={handleModalClose}>
              Feed
            </Button>
          </Link>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddArticle;
