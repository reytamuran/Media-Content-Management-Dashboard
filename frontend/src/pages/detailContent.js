// src/pages/DetailContent.js

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import { useDispatch } from 'react-redux';
import { deleteItem } from '../redux/actions';
import { getMediaItem, deleteMediaItem } from '../services/api';

function DetailContent() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();  // Initialize useNavigate

  useEffect(() => {
    getMediaItem(id).then(response => setItem(response.data)).catch(console.error);
  }, [id]);

  const handleDelete = async () => {
    await deleteMediaItem(id);
    dispatch(deleteItem(id));
    navigate('/');  // Use navigate instead of history.push
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <p>Genre: {item.genre}</p>
      <p>Status: {item.status}</p>
      <p>Upload Date: {item.uploadDate}</p>
      <Link to={`/content/edit/${id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default DetailContent;
