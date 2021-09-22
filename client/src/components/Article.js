import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Card, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';

const axiosInst = Axios.create({ withCredentials: true });

export default function Article({ article, mode = 'md' }) {
  const [articleState, setArticleState] = useState(article);

  console.log(article);

  const fetchArticle = async () => {
    axiosInst.get(`http://localhost:3001/articles/${articleState._id}`).then((response) => {
      console.log('article reloaded:');

      setArticleState(response.data);
    });
  };

  if (articleState.user === undefined) {
    return (
      <Card className="mb-2" bg="secondary" text="white">
        <Card.Body className="py-5">Loading</Card.Body>
      </Card>
    );
  }

  const articleId = articleState._id;
  let timestampOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let timestamp = new Date(articleState.timestamp).toLocaleDateString('en-US', timestampOptions);
  let userDefaultImg = 'http://localhost:3000/uploads/users/' + articleState.user._id + '/' + articleState.user.defaultImg;
  if (articleState.user.defaultImg == null) userDefaultImg = 'https://avatars.dicebear.com/api/personas/' + articleState.user._id + '.svg';

  function modePre() {
    switch (mode) {
      case 'sm':
        return;
        break;
      case 'side':
        return (
          <Link to={`/users/${articleState.user._id}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div>
              <img className="img-thumb bg-secondary me-2" src={userDefaultImg} />
              {articleState.user.username}
            </div>
          </Link>
        );
        break;
      case 'smpre':
        return (
          <Link to={`/users/${articleState.user._id}`} style={{ textDecoration: 'none', color: 'white' }}>
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

      default:
        return (
          <Link to={`/users/${articleState.user._id}`} style={{ textDecoration: 'none', color: 'white' }}>
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
            <FontAwesomeIcon className={articleState.likedByUser ? 'btn-icn-liked text-primary' : 'btn-icn'} onClick={handleLike} icon={faThumbsUp} /> {articleState.likeCount}
            <FontAwesomeIcon className="ms-2" icon={faComment} /> {articleState.commentCount}
          </div>
        );
        break;

      default:
        return (
          <div>
            <p className="mt-1 mb-0">{articleState.content}</p>
            <div>
              <small className="text-muted">
                {articleState.user.username} @ {timestamp}
              </small>
            </div>
            <div>
              <FontAwesomeIcon className={articleState.likedByUser ? 'btn-icn-liked text-primary' : 'btn-icn'} onClick={handleLike} icon={faThumbsUp} /> {articleState.likeCount}
              <FontAwesomeIcon className="ms-2" icon={faComment} /> {articleState.commentCount}
            </div>
          </div>
        );
        break;
    }
  }

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
    <Card className="mb-2" bg="dark" text="white">
      <Card.Body>
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
