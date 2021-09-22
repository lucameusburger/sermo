import React, { useState, useRef, useEffect } from 'react';
import UsersList from '../components/UsersList';
import MenuRight from '../components/MenuRight';
import Navigation from '../components/Navigation';
import Axios from 'axios';

import { Row, Col, Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';

const axiosInst = Axios.create({ withCredentials: true });

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    axiosInst.get('http://localhost:3001/users').then((response) => {
      setUsers(response.data);
    });
  };

  return (
    <>
      <Container>
        <Row>
          <Col lg="8">
            <UsersList users={users} mode="sm" />
          </Col>
          <Col lg="4" className="d-none d-lg-block">
            <MenuRight></MenuRight>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Users;
