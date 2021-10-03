import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../img/logo-white.svg';

import Navigation from '../components/Navigation';

import { Form, Row, Col, Button, FormControl, FormLabel, FormGroup, Card, Container } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function Register() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordTwoRef = useRef();
  const [validated, setValidated] = useState(false);

  function handleRegister(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      return;
    }

    setValidated(true);

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const passwordTwo = passwordTwoRef.current.value;
    if (username === '') return;
    if (password === '') return;
    if (password !== passwordTwo) return;

    axiosInst
      .post('http://localhost:3001/register/', { username: username, password: password })
      .then(function (response) {
        // handle success
        if (response.data.success) {
          window.location.href = '/login';
          usernameRef.current.value = null;
          passwordRef.current.value = null;
          passwordTwoRef.current.value = null;
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
    <div className="w-100 d-flex align-items-center mx-auto">
      <div className="w-banner">
        <div className="text-center mt-5 w-100">
          <Link to="/">
            <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="sermo logo" />
          </Link>
          <h1 className=" fs-2 my-3">Register to sermo</h1>
          <Card className="mb-3">
            <Card.Body>
              <Form noValidate validated={validated}>
                <Row>
                  <Col xs="12">
                    <FormGroup controlId="formGroupTitle" className="text-start mb-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl type="text" placeholder="Enter username" ref={usernameRef} />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup controlId="formGroupPassword" className="text-start mb-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl type="password" placeholder="Enter password" ref={passwordRef} />
                    </FormGroup>
                  </Col>
                  <Col xs="12">
                    <FormGroup controlId="formGroupPasswordTwo" className="text-start">
                      <FormLabel>Password again</FormLabel>
                      <FormControl type="password" placeholder="Enter password again" ref={passwordTwoRef} />
                    </FormGroup>
                  </Col>
                </Row>
                <Form.Control.Feedback type="invalid">Please choose a username.</Form.Control.Feedback>
                <FormGroup className="mt-3" controlId="formGroupSubmit">
                  <Button type="button" onClick={handleRegister} variant="primary" className="w-100">
                    Register
                  </Button>{' '}
                </FormGroup>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <p className=" m-0">
                Already have an account? <Link to="/login">Login</Link>.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Register;
