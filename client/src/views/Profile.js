import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { Button, Row, Col, Container, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import User from '../components/User';

import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

function Profile() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    axiosInst.get(`http://localhost:3001/profile`).then((response) => {
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        window.location.href = './';
      }
    });
  };

  return (
    <>
      <Container>
        <User user={user} />
      </Container>
    </>
  );
}

export default Profile;
