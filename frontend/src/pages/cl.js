// src/pages/ContentListing.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItems, logout } from '../redux/actions';
import { getMediaItems } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './contentListing.css';

function ContentListing() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.items);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    getMediaItems().then(response => {
      dispatch(setItems(response.data));
    }).catch(console.error);
    console.log(items);
  }, [dispatch]);

  return (
    <div className="content-listing">
      <h1>Media Content</h1>
      <Link to="/content/new/" className="add-content-button">Add New Content</Link>
      <button onClick={handleLogout} className="logout-button">Logout</button>

      <table className="content-table">
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <img src={item.thumbnail} alt={item.title} className="thumbnail" />
              </td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.status}</td>
              <td>
                <Link to={`/content/${item.id}`} className="view-details">View Details</Link>
                <Link to={`/content/edit/${item.id}`} className="edit-content">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContentListing;
