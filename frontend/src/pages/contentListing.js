// src/pages/ContentListing.js

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setItems } from '../redux/actions';
import { getMediaItems } from '../services/api';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Card} from 'antd';
import Highlighter from 'react-highlight-words';
import './contentListing.css';

function ContentListing() {
  const dispatch = useDispatch();
  const items = useSelector(state => state.items);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);


  useEffect(() => {
    getMediaItems()
      .then(response => {
        dispatch(setItems(response.data));
      })
      .catch(console.error);
  }, [dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (text) => (
        <img
          src={text.startsWith('http') ? text : `http://localhost:5002${text}`} // Prefix only if not a URL
          alt="thumbnail"
          className="thumbnail"
          style={{ width: '100px', height: 'auto' }}
        />
      ),
      responsive: ['lg'], // Show on large screens only
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
      responsive: ['lg'], // Show on large screens only
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      filters: [
        { text: 'Drama', value: 'Drama' },
        { text: 'Comedy', value: 'Comedy' },
        { text: 'Mystery', value: 'Mystery' },
        { text: 'Documentary', value: 'Documentary' },
      ],
      onFilter: (value, record) => record.genre === value,
      responsive: ['lg'], // Show on large screens only
    },
    {
      title: 'Upload Date',
      dataIndex: 'uploadDate',
      key: 'uploadDate',
      sorter: (a, b) => new Date(a.uploadDate) - new Date(b.uploadDate),
      render: (text) => new Date(text).toLocaleDateString(),
      responsive: ['md'], // Show on large screens only
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Published', value: 'Published' },
        { text: 'Draft', value: 'Draft' },
      ],
      onFilter: (value, record) => record.status === value,
      responsive: ['md'], // Show on medium and large screens only
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/content/${record.id}`} className="view-details">View Details</Link>
          <Link to={`/content/edit/${record.id}`} className="edit-content">Edit</Link>
        </Space>
      ),
    },
  ];


  return (
    <div className="content-listing">
      <Card className="table-card">
        <Table columns={columns} dataSource={items} rowKey="id" />
      </Card>
    </div>
  );
}

export default ContentListing;
