import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

import Navigation from '../components/Navigation';

import { Row, Col, Button, FormControl, FormLabel, FormGroup, Container, Form, Control, Feedback } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function Login() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [validated, setValidated] = useState(false);

  function handleLogin(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log('1111');
      return;
    }

    setValidated(true);

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    if (username === '') return;
    if (password === '') return;
    axiosInst
      .post('http://localhost:3001/login/', { username: username, password: password }, { withCredentials: true })
      .then(function (response) {
        if (response.data.success == true) {
          window.location.href = '../';
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        console.log('alwayss');
      });

    //usernameRef.current.value = null;
    //passwordRef.current.value = null;
  }

  return (
    <Container className="w-banner">
      <h1>Login</h1>
      <img src="./illustrations/election/elections_01.svg" alt="Login illustration" className="img-banner" />
      <Form noValidate validated={validated}>
        <Row>
          <Col md>
            <FormGroup controlId="formGroupTitle">
              <FormLabel>Username</FormLabel>
              <FormControl type="text" placeholder="Enter username" ref={usernameRef} name="username" required />
            </FormGroup>
          </Col>
          <Col md>
            <FormGroup controlId="formGroupContent">
              <FormLabel>Password</FormLabel>
              <FormControl type="password" placeholder="Enter password" ref={passwordRef} name="password" required />
            </FormGroup>
          </Col>
        </Row>
        <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
        <FormGroup className="mt-3" controlId="formGroupSubmit">
          <Button type="button" onClick={handleLogin} variant="dark">
            Login
          </Button>{' '}
          <Link to="/register">
            <Button type="button" variant="outline-dark">
              Register
            </Button>
          </Link>
        </FormGroup>
      </Form>
    </Container>
  );
}

export default Login;
