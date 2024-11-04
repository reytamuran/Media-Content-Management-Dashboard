const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const dataItems = require('./data/data');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Dummy users array for login authentication
const USERS = [
  { username: 'admin', password: 'password' },
  { username: 'reyta', password: 'reyta' },
  { username: 'deneme', password: 'deneme' },
];

// Ensure thumbnail paths consistency
dataItems.forEach(item => {
  if (item.thumbnail && !item.thumbnail.startsWith('http') && !item.thumbnail.startsWith('/uploads/')) {
    item.thumbnail = `/uploads/${item.thumbnail}`;
  }
});

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  // Serve uploaded files from the "uploads" directory
  if (req.method === 'GET' && pathname.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'File not found' }));
      } else {
        res.statusCode = 200;
        res.end(data);
      }
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  // Login route
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);

      // Check if a user matches the provided credentials
      const user = USERS.find(u => u.username === username && u.password === password);

      if (user) {
        res.statusCode = 200;
        res.end(JSON.stringify({ success: true, message: 'Login successful' }));
      } else {
        res.statusCode = 401;
        res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
      }
    });
    return;
  }

  // Create a new item with optional file upload
  if (req.method === 'POST' && pathname === '/api/items') {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: 'Invalid form data' }));
        return;
      }

      const thumbnailFile = files.thumbnail ? (Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail) : null;
      let thumbnailPath = '';

      if (thumbnailFile) {
        const fileExtension = path.extname(thumbnailFile.originalFilename);
        const newFileName = `${thumbnailFile.newFilename}${fileExtension}`;
        const newFilePath = path.join(uploadDir, newFileName);

        fs.rename(thumbnailFile.filepath, newFilePath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'Error processing file upload' }));
            return;
          }

          thumbnailPath = `/uploads/${newFileName}`;
          saveNewItem(res, fields, thumbnailPath);
        });
      } else {
        saveNewItem(res, fields, thumbnailPath);
      }
    });
    return;
  }

  // Get all items
  if (req.method === 'GET' && pathname === '/api/items') {
    res.statusCode = 200;
    res.end(JSON.stringify(dataItems));
    return;
  }

  // Get a specific item by ID
  if (req.method === 'GET' && pathname.startsWith('/api/items/')) {
    const id = parseInt(pathname.split('/').pop());
    const dataItem = dataItems.find(item => item.id === id);

    if (dataItem) {
      res.statusCode = 200;
      res.end(JSON.stringify(dataItem));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }
    return;
  }

  // Update an existing item
  if (req.method === 'PUT' && pathname.startsWith('/api/items/')) {
    const id = parseInt(pathname.split('/').pop());
    const index = dataItems.findIndex(item => item.id === id);

    if (index !== -1) {
      const form = new formidable.IncomingForm();
      form.uploadDir = uploadDir;
      form.keepExtensions = true;

      form.parse(req, (err, fields, files) => {
        if (err) {
          res.statusCode = 400;
          res.end(JSON.stringify({ message: 'Invalid form data' }));
          return;
        }

        const thumbnailPath = files.thumbnail ? `/uploads/${path.basename(files.thumbnail.filepath)}` : dataItems[index].thumbnail;

        dataItems[index] = {
          ...dataItems[index],
          ...fields,
          thumbnail: thumbnailPath,
        };
        res.statusCode = 200;
        res.end(JSON.stringify(dataItems[index]));
      });
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }
    return;
  }

  // Delete an item
  if (req.method === 'DELETE' && pathname.startsWith('/api/items/')) {
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
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Route not found' }));
});

// Helper function to save a new item
function saveNewItem(res, fields, thumbnailPath) {
  const newData = {
    id: dataItems.length + 1,
    title: fields.title[0],
    description: fields.description[0],
    genre: fields.genre[0],
    uploadDate: fields.uploadDate[0],
    status: fields.status[0],
    thumbnail: thumbnailPath,
  };

  dataItems.push(newData);
  res.statusCode = 201;
  res.end(JSON.stringify(newData));
}

server.listen(5002, () => {
  console.log('Server is running on http://localhost:5002');
});
