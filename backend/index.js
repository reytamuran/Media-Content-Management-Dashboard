const http = require('http');
const url = require('url');
const dataItems = require('./data/data');
const formidable = require('formidable');


const parseRequestBody = (req, res, callback) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      callback(JSON.parse(body));
    } catch (error) {
      // Send an error response if JSON parsing fails
      res.statusCode = 400;
      res.end(JSON.stringify({ message: 'Invalid JSON format' }));
    }
  });
};


const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

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
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }

  } else if (req.method === 'POST' && pathname === '/api/items') {
    // Handle photo upload with additional data
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid form data' }));
        return;
      }
      
      // Create a new media item with uploaded photo path
      const newData = {
        id: dataItems.length + 1,
        title: fields.title,
        description: fields.description,
        genre: fields.genre,
        uploadDate: fields.uploadDate,
        status: fields.status,
        thumbnail: files.thumbnail ? files.thumbnail.filepath : null, // Store file path
      };

      dataItems.push(newData);
      res.statusCode = 201;
      res.end(JSON.stringify(newData));
    });

  } else if (req.method === 'PUT' && pathname.startsWith('/api/items/')) {
    // Update an existing media item
    const id = parseInt(pathname.split('/').pop());
    const index = dataItems.findIndex(item => item.id === id);
    if (index !== -1) {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Invalid form data' }));
          return;
        }

        // Update item data and keep existing thumbnail if no new file is provided
        dataItems[index] = {
          ...dataItems[index],
          ...fields,
          thumbnail: files.thumbnail ? files.thumbnail.filepath : dataItems[index].thumbnail,
        };
        res.statusCode = 200;
        res.end(JSON.stringify(dataItems[index]));
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }

  } else if (req.method === 'DELETE' && pathname.startsWith('/api/items/')) {
    // Delete a media item
    const id = parseInt(pathname.split('/').pop());
    const index = dataItems.findIndex(item => item.id === id);
    if (index !== -1) {
      dataItems.splice(index, 1);
      res.statusCode = 200;
      res.end(JSON.stringify({ message: 'Data item deleted' }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }

  } else {
    // Route not found
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// Start the server on port 5002
server.listen(5002, () => {
  console.log('Server is running on http://localhost:5002');
});
