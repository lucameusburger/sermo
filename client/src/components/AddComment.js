import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, FormControl, FormLabel, FormGroup, FormText, Container, Modal, Form, Control, Feedback } from 'react-bootstrap';

import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

export default function AddComment({ article, updater }) {
  const contentRef = useRef();

  function handleAddComment(e) {
    const content = contentRef.current.value;

    if (content === '') return;

    axiosInst
      .post('http://localhost:3001/comment', {
        content: content,
        article: article._id,
      })
      .then(function (response) {
        // handle success
        console.log('comment response');

        if (response.data.success) {
          console.log('success');
          contentRef.current.value = '';
        } else {
          console.log('fail');
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
        console.log('always');
        updater(true);
      });
  }

  return (
    <>
      <Form>
        <Row>
          <Col sm="8" md="10">
            <FormGroup controlId="formGroupTitle" className="my-2">
              <FormControl type="text" placeholder="Enter comment" ref={contentRef} name="content" required />
            </FormGroup>
          </Col>
          <Col sm="4" md="2">
            <Button type="button" onClick={handleAddComment} variant="dark" className="my-2 w-100">
              Post
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
