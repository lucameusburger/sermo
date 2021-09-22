import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormControl, FormLabel, FormGroup, FormText, Container, Modal, Form, Control, Feedback } from 'react-bootstrap';

import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

export default function UserEdit({ user }) {
  const usernameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const webRef = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const bioRef = useRef();
  const imgRef = useRef();

  const [validated, setValidated] = useState(false);

  function handleUpdate(e) {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const phone = phoneRef.current.value;
    const web = webRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;
    const bio = bioRef.current.value;
    const img = imgRef.current.files[0];

    const fd = new FormData();
    fd.append('username', username);
    fd.append('email', email);
    fd.append('phone', phone);
    fd.append('web', web);
    fd.append('firstName', firstName);
    fd.append('lastName', lastName);
    fd.append('bio', bio);
    if (img) fd.append('img', img, img.name);

    if (username === '') return;

    axiosInst
      .put('http://localhost:3001/updateProfile', fd, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${fd._boundary}`,
        },
      })
      .then(function (response) {
        // handle success

        if (response.data.success) {
          alert('success');
        } else {
          alert('fail');
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
      <Form>
        <FormGroup controlId="formGroupUsername" className="my-2">
          <FormLabel>Username</FormLabel>
          <FormControl type="text" placeholder="Enter username" ref={usernameRef} name="username" defaultValue={user.username} required />
        </FormGroup>
        <FormGroup controlId="formGroupEmail" className="my-2">
          <FormLabel>Email</FormLabel>
          <FormControl type="email" placeholder="Enter email" ref={emailRef} name="email" defaultValue={user.email} required />
        </FormGroup>
        <FormGroup controlId="formGroupWeb" className="my-2">
          <FormLabel>Web</FormLabel>
          <FormControl type="url" placeholder="Enter web" ref={webRef} name="web" defaultValue={user.web} />
        </FormGroup>
        <FormGroup controlId="formGroupPhone" className="my-2">
          <FormLabel>Phone</FormLabel>
          <FormControl type="tel" placeholder="Enter phone" ref={phoneRef} name="phone" defaultValue={user.phone} />
        </FormGroup>
        <FormGroup controlId="formGroupFirstName" className="my-2">
          <FormLabel>First name</FormLabel>
          <FormControl type="text" placeholder="Enter first name" ref={firstNameRef} name="firstName" defaultValue={user.firstName} />
        </FormGroup>
        <FormGroup controlId="formGroupLastName" className="my-2">
          <FormLabel>Last name</FormLabel>
          <FormControl type="text" placeholder="Enter last name" ref={lastNameRef} name="lastName" defaultValue={user.lastName} />
        </FormGroup>
        <FormGroup controlId="formGroupBio" className="my-2">
          <FormLabel>Bio</FormLabel>
          <FormControl type="text" placeholder="Enter bio" ref={bioRef} name="bio" defaultValue={user.bio} />
        </FormGroup>
        <Form.Group controlId="formGroupImg" className="my-2">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" ref={imgRef} />
        </Form.Group>
        <Button type="button" onClick={handleUpdate} variant="dark" className="my-2">
          Save
        </Button>{' '}
        <Link to="/profile">
          <Button type="button" variant="outline-dark" className="my-2">
            Cancel
          </Button>
        </Link>
      </Form>
    </>
  );
}
