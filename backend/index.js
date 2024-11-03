const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const dataItems = require('./data/data');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

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

  if (req.method === 'GET' && pathname.startsWith('/uploads/')) {
    const filePath = path.join(__dirname, pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(`File not found: ${filePath}`);
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

  if (req.method === 'POST' && pathname === '/api/items') {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
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
            console.error("Error renaming file:", err);
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
  if (req.method === 'GET' && pathname === '/api/items') {
    console.log("Fetched all items:", dataItems);
    res.statusCode = 200;
    res.end(JSON.stringify(dataItems));
    return;
  }
  
  if (req.method === 'GET' && pathname.startsWith('/api/items/')) {
    const id = parseInt(pathname.split('/').pop());
    const dataItem = dataItems.find(item => item.id === id);
    
    if (dataItem) {
      console.log(`Item found: ${JSON.stringify(dataItem)}`);
      res.statusCode = 200;
      res.end(JSON.stringify(dataItem));
    } else {
      console.log(`Item with ID ${id} not found.`);
      res.statusCode = 404;
      res.end(JSON.stringify({ message: 'Data item not found' }));
    }
    return;
  }
  

  // Route to Update an Existing Media Item
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
  // DELETE: Route to Delete a Media Item
if (req.method === 'DELETE' && pathname.startsWith('/api/items/')) {
  const id = parseInt(pathname.split('/').pop());
  const index = dataItems.findIndex(item => item.id === id);
  
  if (index !== -1) {
    dataItems.splice(index, 1);
    console.log(`Item with ID ${id} deleted.`);
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Data item deleted' }));
  } else {
    console.log(`Item with ID ${id} not found.`);
    res.statusCode = 404;
    res.end(JSON.stringify({ message: 'Data item not found' }));
  }
  return;
}

// 404: Route not found
res.statusCode = 404;
res.end(JSON.stringify({ message: 'Route not found' }));


  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Route not found' }));
});

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
  console.log('New item added:', newData);

  res.statusCode = 201;
  res.end(JSON.stringify(newData));
}

server.listen(5002, () => {
  console.log('Server is running on http://localhost:5002');
});
