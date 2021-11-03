import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../img/logo-white.svg';
import { useUser, useUserUpdate } from '../hooks/UserContext';

import { Row, Col, Button, FormControl, FormLabel, FormGroup, Card, Form, Container, Feedback } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function Login() {
  const setAuthUser = useUserUpdate();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [validated, setValidated] = useState(false);

  function handleLogin(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
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
  }

  return (
    <div className="w-100 d-flex align-items-center mx-auto">
      <div className="w-banner w-100">
        <div className="text-center mt-5">
          <Link to="/">
            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="sermo logo" />
          </Link>
          <h1 className=" fs-2 my-3">Log in to sermo</h1>
          <Card className="mb-3">
            <Card.Body>
              <Form noValidate validated={validated}>
                <Row>
                  <Col xs="12" className="mb-2">
                    <FormGroup controlId="formGroupUsername" className="text-start">
                      <FormLabel>Username</FormLabel>
                      <FormControl type="text" placeholder="Enter username" ref={usernameRef} name="username" required />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup controlId="formGroupPassword" className="text-start">
                      <FormLabel>Password</FormLabel>
                      <FormControl type="password" placeholder="Enter password" ref={passwordRef} name="password" required />
                    </FormGroup>
                  </Col>
                </Row>
                <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                <FormGroup className="mt-3" controlId="formGroupSubmit">
                  <Button type="button" onClick={handleLogin} variant="primary" className="w-100">
                    Login
                  </Button>{' '}
                </FormGroup>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className=" m-0">
                New to sermo? <Link to="/register">Create an account</Link>.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;
