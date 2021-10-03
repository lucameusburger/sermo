import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCommentAlt, faEnvelope, faPhone, faLink } from '@fortawesome/free-solid-svg-icons';
import { Row, Col, Button, Card, FormLabel, FormGroup, FormText, Container, Modal, Form, Control, Feedback } from 'react-bootstrap';

import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

export default function User({ user, mode = 'md' }) {
  const [userState, setUserState] = useState(user);

  console.log(userState);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  const fetchUser = async () => {
    console.log(userState._id);
    axiosInst.get(`http://localhost:3001/users/${userState._id}`).then((response) => {
      console.log(response.data);
      setUserState(response.data);
    });
  };

  const handleFollow = async () => {
    axiosInst
      .post('http://localhost:3001/follow/', { user: userState._id })
      .then(function (response) {
        fetchUser();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (!userState) {
    return (
      <Card className="mb-2">
        <Card.Body className="py-5">Loading</Card.Body>
      </Card>
    );
  }

  let defaultImg = 'http://localhost:3000/uploads/users/' + userState._id + '/' + userState.defaultImg;
  if (userState.defaultImg == null) defaultImg = 'https://avatars.dicebear.com/api/personas/' + userState._id + '.svg';

  switch (mode) {
    case 'sm':
      return (
        <Link to={'/' + userState.username} style={{ textDecoration: 'none', color: 'white' }}>
          <Card className="mb-2">
            <Row>
              <Col xs="2" sm="2" md="1" className="d-flex align-items-center">
                <img className="img-user-profile bg-dark rounded-circle m-2" src={defaultImg} />
              </Col>
              <Col xs="10" sm="10" md="11" className="d-flex align-items-center">
                <div>
                  <h3 className="fs-5 fw-bolder m-0">{userState.firstName + userState.lastName || userState.username}</h3>
                  <h4 className="fs-6 text-muted mb-0">{userState.username}</h4>
                </div>
              </Col>
            </Row>
          </Card>
        </Link>
      );
      break;
    case 'profile':
      return (
        <div>
          <Row>
            <Col xs="3" sm="3" md="12" className="d-flex align-items-center">
              <img className="img-user-profile bg-dark rounded-circle mb-3" src={defaultImg} />
            </Col>
            <Col xs="9" sm="9" md="12" className="d-flex align-items-center">
              <div>
                <h1 className="h3 fw-bolder m-0">{!(userState.firstName + userState.lastName) ? userState.username : userState.firstName + userState.lastName}</h1>
                <h2 className="h4 text-muted mb-3">{userState.username}</h2>
              </div>
            </Col>
          </Row>

          <div className="mb-4">{userState.bio}</div>

          <div className="mb-4">
            <Button className="w-100" size="sm" variant={userState.followedByCurrentUser ? 'dark' : 'primary'} onClick={handleFollow}>
              {userState.followedByCurrentUser ? 'Unfollow' : 'Follow'}
            </Button>
          </div>
          <p className="my-2">
            <FontAwesomeIcon icon={faUsers} /> <span className="mx-2">{userState.followersCount}</span>followers
            <br />
            <FontAwesomeIcon icon={faEnvelope} />{' '}
            <span className="mx-2">
              <a className="link-light" href={'mailto:' + userState.email}>
                {userState.email}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faLink} />{' '}
            <span className="mx-2">
              <a className="link-light" href={userState.web}>
                {userState.web}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faPhone} />{' '}
            <span className="mx-2">
              <a className="link-light" href={'tel:' + userState.phone}>
                {userState.phone}
              </a>
            </span>
          </p>
          <hr />
        </div>
      );
      break;

    default:
      return (
        <Link to={'/' + userState.username} style={{ textDecoration: 'none', color: 'white' }}>
          <Card className="mb-2">
            <div className="d-flex align-items-center">
              <img className="img-profile bg-dark rounded-s me-3" src={defaultImg} />
              <div>
                <h3 className="mb-0">
                  <b>
                    {userState.firstName} {userState.lastName}
                  </b>
                </h3>
                <div className="mb-2">
                  <span>{userState.username}</span>
                  <br />
                  <span>{userState.bio}</span>
                </div>
              </div>
            </div>
          </Card>
          <p className="my-2">
            <FontAwesomeIcon icon={faUsers} /> <span className="mx-2">{userState.followersCount}</span>
            <br />
            <FontAwesomeIcon icon={faEnvelope} />{' '}
            <span className="mx-2">
              <a className="link-light" href={'mailto:' + userState.email}>
                {userState.email}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faLink} />{' '}
            <span className="mx-2">
              <a className="link-light" href={userState.web}>
                {userState.web}
              </a>
            </span>
            <br />
            <FontAwesomeIcon icon={faPhone} />{' '}
            <span className="mx-2">
              <a className="link-light" href={'tel:' + userState.phone}>
                {userState.phone}
              </a>
            </span>
          </p>
        </Link>
      );
      break;
  }
}
