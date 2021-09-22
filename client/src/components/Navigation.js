import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt, faFeatherAlt, faUsers, faUserPlus, faCogs, faSearch } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/logo-white.svg';
import { Nav, Dropdown, NavDropdown, Button, Row, Col, Container, Navbar } from 'react-bootstrap';
import Axios from 'axios';
const axiosInst = Axios.create({ withCredentials: true });

export default function Navigation() {
  const [user, setUser] = useState({});
  const [loggedImg, setLoggedImg] = useState('https://avatars.dicebear.com/api/personas/' + Math.random() + '.svg');

  function handleLogged(e) {
    axiosInst
      .post('http://localhost:3001/checkLogged')
      .then(function (response) {
        if (response.data.user) {
          setUser(response.data.user);
          setLoggedImg('http://localhost:3000/uploads/users/' + response.data.user._id + '/' + response.data.user.defaultImg);
          if (response.data.user.defaultImg == null) setLoggedImg('https://avatars.dicebear.com/api/personas/' + response.data.user._id + '.svg');
        }
      })
      .catch(function (error) {});
  }

  function handleLogout(e) {
    axiosInst.post('http://localhost:3001/logout').then(function (response) {
      window.location.href = './';
    });
  }

  const authenticateNav = () => {
    if (user._id) {
      return (
        <Nav>
          <NavDropdown
            align="end"
            id="nav-dropdown-dark-example"
            title={
              <div>
                {user.username || 'login'}
                <img className="img-thumb ms-2 bg-secondary hide-text-img-thumb" src={loggedImg} alt="User image" />
              </div>
            }
            menuVariant="dark"
          >
            <Link className="dropdown-item" to="./profile">
              Profile
            </Link>
            <Link className="dropdown-item" to="./profile-edit">
              Edit profile
            </Link>
            <NavDropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
          </NavDropdown>
        </Nav>
      );
    }
    return (
      <Nav>
        <Link className="no-style nav-link" to="/login">
          login
          <img className="img-thumb ms-2 bg-secondary hide-text-img-thumb" src={loggedImg} alt="User image" />
        </Link>
      </Nav>
    );
  };

  return (
    <div>
      <Navbar onLoad={handleLogged} fixed="top" bg="dark" variant="dark">
        <Container>
          <Link className="no-style" to={''}>
            <Navbar.Brand>
              <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="SERMO logo" /> SERMO
            </Navbar.Brand>
          </Link>
          {authenticateNav()}
        </Container>
      </Navbar>
      <div style={{ height: '64px' }}></div>
      <Navbar fixed="bottom" bg="dark" variant="dark" expand="lg" className="justify-content-center">
        <Row className="w-100 text-center">
          <Col>
            <Link to="/">
              <Button variant="dark" className="flex-1 w-100">
                <FontAwesomeIcon icon={faCommentAlt} />
              </Button>
            </Link>
          </Col>
          <Col>
            <Link to="/users">
              <Button variant="dark" className="flex-1 w-100">
                <FontAwesomeIcon icon={faUsers} />
              </Button>
            </Link>
          </Col>
          <Col>
            <Link to="/search">
              <Button variant="dark" className="flex-1 w-100">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Link>
          </Col>
          <Col>
            <Link to="/add-article">
              <Button variant="dark" className="flex-1 w-100">
                <FontAwesomeIcon icon={faFeatherAlt} />
              </Button>
            </Link>
          </Col>
        </Row>
      </Navbar>
    </div>
  );
}
