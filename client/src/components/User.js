import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faEnvelope, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { Button, Card, FormLabel, FormGroup, FormText, Container, Modal, Form, Control, Feedback } from 'react-bootstrap';

import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

export default function User({ user = {}, mode = 'md' }) {
  let defaultImg = 'http://localhost:3000/uploads/users/' + user._id + '/' + user.defaultImg;
  if (user.defaultImg == null) defaultImg = 'https://avatars.dicebear.com/api/personas/' + user._id + '.svg';

  function handleLogout(e) {
    axiosInst.post('http://localhost:3001/logout').then(function (response) {
      window.location.href = './';
    });
  }

  if (user == null) {
    return 'No user found';
  }

  const modePost = () => {
    switch (mode) {
      case 'sm':
        return;
        break;
      case 'profile':
        return (
          <div>
            <div className="mb-2">
              <Link to="profile-edit">
                <Button variant="dark">Edit Profile</Button>
              </Link>{' '}
              <Button onClick={handleLogout} variant="outline-dark">
                Logout
              </Button>
            </div>
            <p className="my-2">
              <FontAwesomeIcon icon={faEnvelope} />{' '}
              <span className="mx-2">
                <a className="link-dark" href={'mailto:' + user.email}>
                  {user.email}
                </a>
              </span>
              <br />
              <FontAwesomeIcon icon={faGlobe} />{' '}
              <span className="mx-2">
                <a className="link-dark" href={user.web}>
                  {user.web}
                </a>
              </span>
              <br />
              <FontAwesomeIcon icon={faPhone} />{' '}
              <span className="mx-2">
                <a className="link-dark" href={'tel:' + user.phone}>
                  {user.phone}
                </a>
              </span>
            </p>
          </div>
        );
        break;

      default:
        return (
          <p className="my-2">
            <FontAwesomeIcon icon={faEnvelope} />{' '}
            <span className="mx-2">
              <a className="link-dark" href={'mailto:' + user.email}>
                {user.email}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faGlobe} />{' '}
            <span className="mx-2">
              <a className="link-dark" href={user.web}>
                {user.web}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faPhone} />{' '}
            <span className="mx-2">
              <a className="link-dark" href={'tel:' + user.phone}>
                {user.phone}
              </a>
            </span>
          </p>
        );
        break;
    }
  };

  return (
    <Link to={`/users/${user._id}`} style={{ textDecoration: 'none', color: 'white' }}>
      <Card className="mb-2" bg="dark" text="white">
        <div className="d-flex align-items-center">
          <img className="img-profile bg-secondary rounded-s me-3" src={defaultImg} />
          <div>
            <h3 className="mb-0">
              <b>
                {user.firstName} {user.lastName}
              </b>
            </h3>
            <div className="mb-2">
              <span>{user.username}</span>
              <br />
              <span>{user.bio}</span>
            </div>
          </div>
        </div>
      </Card>
      {modePost()}
    </Link>
  );
}
