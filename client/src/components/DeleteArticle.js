import React, { useRef, useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
const axiosInst = Axios.create({ withCredentials: true });

const DeleteArticle = ({ article, show, showModal }) => {
  const handleDeleteArticle = () => {
    axiosInst
      .delete(`http://localhost:3001/articles/${article._id}`)
      .then(function (response) {
        if (response.data && response.data.success) {
          console.log('success');
          showModal(false);
          return;
        }
        console.log('fail');
        return;
      })
      .catch(function (error) {});
  };

  return (
    <Modal show={show} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header className="bg-darkblue">
        <Modal.Title id="contained-modal-title-vcenter">Delete Article</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-darkblue">
        <p>
          Do you really want to delete this <b>{article.content}</b> article? This step can't be undone.
        </p>
      </Modal.Body>
      <Modal.Footer className="bg-darkblue">
        <Button
          variant="dark"
          onClick={() => {
            showModal(false);
          }}
        >
          Close
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            handleDeleteArticle();
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DeleteArticle;
