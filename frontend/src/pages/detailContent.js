// src/pages/DetailContent.js

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../redux/actions';
import { getMediaItem, deleteMediaItem } from '../services/api';

function DetailContent() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getMediaItem(id)
      .then(response => {
        setItem(response.data);
      })
      .catch(err => {
        console.error("Error fetching item:", err);
        setError("Failed to load content details. Please try again.");
      });
  }, [id]);
  console.log(`Fetching item at URL: http://localhost:5002/api/items/${id}`);


  const handleDelete = async () => {
    try {
      await deleteMediaItem(id);
      dispatch(deleteItem(id));
      navigate('/content-listing');
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete content. Please try again.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!item) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1>{item.title}</h1>

      {/* Display thumbnail if available */}
      {item.thumbnail && (
        <img
          src={item.thumbnail.startsWith('/uploads/') ? `http://localhost:5002${item.thumbnail}` : item.thumbnail}
          alt="Thumbnail"
          style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '20px' }}
        />
      )}

      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Genre:</strong> {item.genre}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Upload Date:</strong> {item.uploadDate}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Link to={`/content/edit/${id}`} style={{ textDecoration: 'none', color: '#1677ff' }}>
          <button style={{ padding: '10px 20px', backgroundColor: '#1677ff', color: 'white', border: 'none', borderRadius: '4px' }}>Edit</button>
        </Link>
        <button
          onClick={handleDelete}
          style={{ padding: '10px 20px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DetailContent;
