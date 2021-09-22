import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import Article from './Article';
import { Form } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

const SelectParties = (props, ref) => {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    axiosInst
      .get('http://localhost:3001/parties/')
      .then((response) => {
        setParties(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Form.Control required as="select" aria-label="Default select example" ref={ref}>
      <option key={'empty'} value={''}>
        None
      </option>
      {parties.map((party) => {
        return (
          <option key={party._id} value={party._id}>
            {party.title}
          </option>
        );
      })}
    </Form.Control>
  );
};

export default forwardRef(SelectParties);
