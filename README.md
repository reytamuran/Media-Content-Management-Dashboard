# Media-Content-Management-Dashboard

## For running project locally

After cloning the repository, open two terminals: one for the frontend and one for the backend.


** For Backend; **

### `npm install`

This command install all necessary packages.

### `node index.js`

Your backend server should now be running on http://localhost:5002

** For Frontend; **

### `npm install`

This command install all necessary packages.

### `npm start`

Runs the app in the development mode.
Open http://localhost:3000 to view it in your browser.

## Development Process

* Throughout the project, I used in-memory data. There are three users available for login. Access to other pages is not possible without logging in. Therefore, only the logo is visible in the header.

 ### { username: 'admin', password: 'password' }
 ### { username: 'reyta', password: 'reyta' }
 ### { username: 'deneme', password: 'deneme' }


* When the user logs in, the Content List appears. Here, you can see a table with 25 entries of dummy data, which I generated randomly using ChatGPT. 
* You can filter by typing in the Title and Description columns. For Genre and Status, you can select the filters using checkboxes. For the Upload Date, I added ascending and descending sorting options. Each filter can be reset individually. 
* If you click on "view details" in the Actions section, you’ll be taken to the content's detail page, where you can edit the entry if desired. The same button is also available on the homepage. If you press the delete button, the entry is removed from the list. I chose not to place the delete button on the homepage, as it should not be easily accessible to the user. 
* If you click on "Create Content" in the Header, you’ll be directed to the Create Item Content page. From there, you can either publish the content or save it as a draft. However, you cannot create a draft without a title, and publishing requires all sections to be completed.
* If you click on logout, you will be redirected back to the login page, completing the logout process. 

* I could have written the HTTP code more easily using the Express library. However, I chose not to use a library I hadn’t worked with before given the limited time.