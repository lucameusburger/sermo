import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import Axios from 'axios';
import { Form } from 'react-bootstrap';

const axiosInst = Axios.create({ withCredentials: true });

const SelectPolitician = (props, ref) => {
  const [politicians, setPoliticians] = useState([]);

  useEffect(() => {
    fetchPoliticians();
  }, []);

  const fetchPoliticians = async () => {
    axiosInst
      .get('http://localhost:3001/politicians/')
      .then((response) => {
        setPoliticians(response.data);
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
      {politicians.map((politician) => {
        return (
          <option key={politician._id} value={politician._id}>
            {politician.firstName} {politician.lastName}
          </option>
        );
      })}
    </Form.Control>
  );
};

export default forwardRef(SelectPolitician);
