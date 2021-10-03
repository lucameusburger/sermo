import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faThumbsUp, faComment, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const axiosInst = Axios.create({ withCredentials: true });

export default function Article({ article, mode = 'md', showModal, setModalArticle, editable = false }) {
  const [articleState, setArticleState] = useState(article);

  const fetchArticle = async () => {
    axiosInst.get(`http://localhost:3001/articles/${articleState._id}`).then((response) => {
      setArticleState(response.data);
    });
  };

  if (articleState.user === undefined) {
    return (
      <Card className="mb-2">
        <Card.Body className="py-5">Loading</Card.Body>
      </Card>
    );
  }

  const articleId = articleState._id;
  let timestampOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let timestamp = new Date(articleState.timestamp).toLocaleDateString('en-US', timestampOptions);
  let userDefaultImg = 'http://localhost:3000/uploads/users/' + articleState.user._id + '/' + articleState.user.defaultImg;
  if (articleState.user.defaultImg == null) userDefaultImg = 'https://avatars.dicebear.com/api/personas/' + articleState.user.username + '.svg';

  function modePre() {
    switch (mode) {
      case 'sm':
        return;
        break;
      case 'side':
        return (
          <Link to={`/${articleState.user.username}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div>
              <img className="img-thumb bg-secondary me-2" src={userDefaultImg} />
              {articleState.user.username}
            </div>
          </Link>
        );
        break;
      case 'smpre':
        return (
          <Link to={`/${articleState.user.username}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div>
              <img className="img-thumb bg-secondary me-2" src={userDefaultImg} />
              {articleState.user.username}
            </div>
          </Link>
        );
        break;
      case 'smpost':
        return;
        break;
      case 'profile':
        return;
        break;

      default:
        return (
          <Link to={`/${articleState.user.username}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div>
              <img className="img-thumb bg-secondary me-2" src={userDefaultImg} />
              {articleState.user.username}
            </div>
          </Link>
        );
        break;
    }
  }
  function modePost() {
    switch (mode) {
      case 'side':
        return;
        break;
      case 'sm':
        return <p className="mt-1 mb-0">{articleState.content}</p>;
        break;
      case 'smpre':
        return <p className="mt-1 mb-0">{articleState.content}</p>;
        break;
      case 'smpost':
        return (
          <div>
            <p className="mt-1 mb-0">{articleState.content}</p>
            <div>
              <small className="text-muted">
                {articleState.user.username} @ {timestamp}
              </small>
            </div>
            <FontAwesomeIcon className={articleState.likedByCurrentUser ? 'btn-icn-liked text-primary' : 'btn-icn'} onClick={handleLike} icon={faThumbsUp} /> {articleState.likeCount}
            <FontAwesomeIcon className="ms-2" icon={faComment} /> {articleState.commentCount}
          </div>
        );
        break;
      case 'profile':
        return (
          <div>
            <p className="mt-1 mb-0">{articleState.content}</p>
            <div>
              <small className="text-muted">{timestamp}</small>
            </div>
            <FontAwesomeIcon className={articleState.likedByCurrentUser ? 'btn-icn-liked text-primary' : 'btn-icn'} onClick={handleLike} icon={faThumbsUp} /> {articleState.likeCount}
            <FontAwesomeIcon className="ms-2" icon={faComment} /> {articleState.commentCount}
          </div>
        );
        break;

      default:
        return (
          <div>
            <p className="mt-1 mb-0">{articleState.content}</p>
            <div>
              <small className="text-muted">{timestamp}</small>
            </div>
            <div>
              <FontAwesomeIcon className={articleState.likedByCurrentUser ? 'btn-icn-liked text-primary' : 'btn-icn'} onClick={handleLike} icon={faThumbsUp} /> {articleState.likeCount}
              <FontAwesomeIcon className="ms-2" icon={faComment} /> {articleState.commentCount}
            </div>
          </div>
        );
        break;
    }
  }

  const handleShowDeleteModal = () => {
    setModalArticle(articleState);
    showModal(true);
  };

  const modeCurrentUser = () => {
    if (editable && articleState.byCurrentUser) {
      return (
        <Dropdown align="end" className="position-absolute" style={{ right: '1rem' }}>
          <Dropdown.Toggle id="dropdown-button-dark-example1" variant="dark">
            <FontAwesomeIcon className="btn-icn" icon={faEllipsisH} />
          </Dropdown.Toggle>

          <Dropdown.Menu variant="dark">
            <Dropdown.Item href="#/action-2">View</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Like</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Comment</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item href="#/action-2">Edit</Dropdown.Item>
            <Dropdown.Item className="text-danger" onClick={handleShowDeleteModal}>
              <FontAwesomeIcon className="me-2" icon={faTrash} />
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else {
      return;
    }
  };

  function handleLike(e) {
    e.preventDefault();
    axiosInst
      .post('http://localhost:3001/like/', { article: articleState._id })
      .then(function (response) {
        fetchArticle();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Card className="mb-2">
      <Card.Body>
        {modeCurrentUser()}
        {modePre()}
        <Link to={`/articles/${articleId}`} style={{ textDecoration: 'none', color: 'white' }}>
          <p className="mb-0 mt-1">
            <b>{articleState.title}</b>
          </p>
          {modePost()}
        </Link>
      </Card.Body>
    </Card>
  );
}
