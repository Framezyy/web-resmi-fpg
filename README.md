# PT Fachri Property Group

## Project Overview
This project is a web application for PT Fachri Property Group, featuring a React frontend and a PHP backend. The application includes a landing page, a navigation bar, and sections for Home, About Us, Properties, and Contact Us. It also integrates with a database to manage property listings.

## Project Structure
```
pt-fachri-property-group
├── client
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── AboutUs.jsx
│   │   │   ├── Properties.jsx
│   │   │   └── ContactUs.jsx
│   │   ├── styles
│   │   │   └── App.css
│   │   └── services
│   │       └── api.js
│   └── package.json
├── server
│   ├── api
│   │   ├── properties.php
│   │   └── contact.php
│   ├── config
│   │   └── database.php
│   ├── models
│   │   └── Property.php
│   └── index.php
├── database
│   └── schema.sql
└── README.md
```

## Getting Started

### Prerequisites
- Node.js and npm installed for the React frontend.
- PHP and a web server (like Apache or Nginx) installed for the PHP backend.
- MySQL or another compatible database system.

### Installation

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd pt-fachri-property-group
   ```

2. **Set up the client:**
   ```
   cd client
   npm install
   ```

3. **Set up the server:**
   - Navigate to the `server` directory and configure the database connection in `config/database.php`.
   - Run the SQL commands in `database/schema.sql` to create the necessary tables.

4. **Run the applications:**
   - Start the PHP server (e.g., using `php -S localhost:8000` in the `server` directory).
   - Start the React application:
     ```
     cd client
     npm start
     ```

### Usage
- Access the application in your web browser at `http://localhost:3000`.
- Navigate through the sections using the navbar.
- View property listings and submit contact forms.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
# web-resmi-fpg
cakkocak
