const http = require('http');
const url = require('url');
const dataItems = require('./data/data');
const cors = require('cors');


const parseRequestBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      callback(JSON.parse(body));
    });
  };


  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    const parsedUrl = url.parse(req.url, true);
    const { pathname, query } = parsedUrl;
  
    // Set response headers for JSON
    res.setHeader('Content-Type', 'application/json');
  
    // Routing Logic
    if (req.method === 'GET' && pathname === '/api/items') {
      // List all media items
      res.statusCode = 200;
      res.end(JSON.stringify(dataItems));
    } else if (req.method === 'GET' && pathname.startsWith('/api/items/')) {
      // Get a specific media item
      const id = parseInt(pathname.split('/').pop());
      const dataItem = dataItems.find(item => item.id === id);
      if (dataItem) {
        res.statusCode = 200;
        res.end(JSON.stringify(dataItem));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'data item not found' }));
      }
    } else if (req.method === 'POST' && pathname === '/api/items') {
      // Create a new media item
      parseRequestBody(req, (newdata) => {
        newdata.id = dataItems.length + 1;
        dataItems.push(newdata);
        res.statusCode = 201;
        res.end(JSON.stringify(newdata));
      });
    } else if (req.method === 'PUT' && pathname.startsWith('/api/items/')) {
      // Update an existing media item
      const id = parseInt(pathname.split('/').pop());
      const index = dataItems.findIndex(item => item.id === id);
      if (index !== -1) {
        parseRequestBody(req, (updatedData) => {
          dataItems[index] = { ...dataItems[index], ...updatedData };
          res.statusCode = 200;
          res.end(JSON.stringify(dataItems[index]));
        });
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'data item not found' }));
      }
    } else if (req.method === 'DELETE' && pathname.startsWith('/api/items/')) {
      // Delete a media item
      const id = parseInt(pathname.split('/').pop());
      const index = dataItems.findIndex(item => item.id === id);
      if (index !== -1) {
        dataItems.splice(index, 1);
        res.statusCode = 200;
        res.end(JSON.stringify({ message: 'data item deleted' }));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'data item not found' }));
      }
    } else {
      // Route not found
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Route not found' }));
    }
  });
  
  // Start the server on port 5000
  server.listen(5002, () => {
    console.log('Server is running on http://localhost:5002');
  });