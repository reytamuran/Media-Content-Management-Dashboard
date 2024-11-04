import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteItem } from '../redux/actions';
import { getMediaItem, deleteMediaItem } from '../services/api';
import './detailContent.css';

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
    <div className="detail-container">
      <div className="detail-thumbnail-info">
        <div className="detail-thumbnail-section">
          {item.thumbnail && (
            <img
              src={item.thumbnail.startsWith('/uploads/') ? `http://localhost:5002${item.thumbnail}` : item.thumbnail}
              alt="Thumbnail"
              className="detail-thumbnail"
            />
          )}
        </div>

        <div className="detail-info-section">
          <h1 className="detail-title">{item.title}</h1>
          <p className="detail-text"><strong>Description:</strong> {item.description}</p>
          <p className="detail-text"><strong>Genre:</strong> {item.genre}</p>
          <p className="detail-text"><strong>Status:</strong> {item.status}</p>
          <p className="detail-text"><strong>Upload Date:</strong> {item.uploadDate}</p>
        </div>
      </div>

      <div className="detail-buttons">
        <Link to={`/content/edit/${id}`} style={{ textDecoration: 'none' }}>
          <button className="detail-button detail-button-edit">Edit</button>
        </Link>
        <button
          onClick={handleDelete}
          className="detail-button detail-button-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default DetailContent;
