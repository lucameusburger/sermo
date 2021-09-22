import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';

import Navigation from '../components/Navigation';

import { Row, Col, Button, FormControl, FormLabel, FormGroup, Container, Modal } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

function Register() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordTwoRef = useRef();

  const [modalShow, setModalShow] = useState(false);
  const [modalMsg, setModalMsg] = useState(false);
  const handleModalClose = () => setModalShow(false);
  const handleModalShow = () => setModalShow(true);

  function handleRegister(e) {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const passwordTwo = passwordTwoRef.current.value;
    if (username === '') return;
    if (password === '') return;
    if (password !== passwordTwo) return;
    usernameRef.current.value = null;
    passwordRef.current.value = null;
    passwordTwoRef.current.value = null;

    axiosInst
      .post('http://localhost:3001/register/', { username: username, password: password })
      .then(function (response) {
        // handle success

        if (response.data.success) {
          setModalMsg(response.data.msg);
          handleModalShow();
        } else {
          setModalMsg(response.data.msg);
          handleModalShow();
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
    <div>
      <Container className="w-banner">
        <h1>Register</h1>
        <img src="./illustrations/election/elections_02.svg" alt="Login illustration" className="img-banner" />
        <Row>
          <Col lg>
            <FormGroup controlId="formGroupTitle">
              <FormLabel>Username</FormLabel>
              <FormControl type="text" placeholder="Enter username" ref={usernameRef} />
            </FormGroup>
          </Col>
          <Col lg>
            <Row>
              <Col md>
                <FormGroup controlId="formGroupPassword">
                  <FormLabel>Password</FormLabel>
                  <FormControl type="password" placeholder="Enter password" ref={passwordRef} />
                </FormGroup>
              </Col>
              <Col md>
                <FormGroup controlId="formGroupPasswordTwo">
                  <FormLabel>Password again</FormLabel>
                  <FormControl type="password" placeholder="Enter password again" ref={passwordTwoRef} />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <FormGroup className="mt-3" controlId="formGroupSubmit">
          <Button variant="dark" onClick={handleRegister}>
            Register
          </Button>{' '}
          <Link to="/login">
            <Button variant="outline-dark">Login</Button>
          </Link>
        </FormGroup>
      </Container>

      <Modal show={modalShow} onHide={handleModalClose} centered>
        <Modal.Body className="text-center bg-dark text-white py-5">
          <h4>Successfully registrated</h4>
          <p>
            <small>{modalMsg}</small>
          </p>
          <Link to="/login">
            <Button variant="light" onClick={handleModalClose}>
              Login
            </Button>
          </Link>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Register;
