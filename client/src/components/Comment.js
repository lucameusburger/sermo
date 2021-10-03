import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function Comment({ comment, mode = 'md' }) {
  if (comment == undefined) {
    return (
      <Card className="mb-2" bg="secondary" text="white">
        <Card.Body className="py-5">Loading comments</Card.Body>
      </Card>
    );
  }

  let timestampOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let timestamp = new Date(comment.timestamp).toLocaleDateString('en-US', timestampOptions);
  let userDefaultImg = 'http://localhost:3000/uploads/users/' + comment.user._id + '/' + comment.user.defaultImg;
  if (comment.user.defaultImg == null) userDefaultImg = 'https://avatars.dicebear.com/api/personas/' + comment.user.username + '.svg';

  function modePre() {
    if (mode == 'sm') return;
    return (
      <Link to={'/' + comment.user.username} style={{ textDecoration: 'none', color: 'white' }}>
        <div className="d-flex align-items-center">
          <img className="img-thumb me-2 bg-secondary" src={userDefaultImg} alt="User image" />
          {comment.user.username}
        </div>
      </Link>
    );
  }
  function modePost() {
    if (mode == 'sm') return;
    return (
      <div>
        <small className="text-muted">{timestamp}</small>
      </div>
    );
  }

  return (
    <Card className="mb-2" bg="dark" text="white">
      <Card.Body>
        {modePre()}
        <p className="my-1">{comment.content}</p>
        {modePost()}
      </Card.Body>
    </Card>
  );
}
