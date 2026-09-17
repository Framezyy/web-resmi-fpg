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

### Laragon setup (Windows)

1. Start Apache and MySQL from Laragon.
2. Make the project available at `C:\laragon\www\web-resmi-fpg`. You can clone it
   there or create a directory junction from another working directory.
3. Import the complete database schema from the repository root:

   ```powershell
   Get-Content .\database\schema.sql -Raw |
       & C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe -uroot
   ```

4. Create or update a local admin account. Use a unique password with at least
   12 characters:

   ```powershell
   $env:FPG_ADMIN_PASSWORD = 'replace-with-a-local-password'
   php .\database\create-local-admin.php
   ```

   The local admin username is `admin_fpg` and its email is
   `admin@localhost.test`.

5. Install and start the React client:

   ```powershell
   cd client
   npm.cmd ci
   npm.cmd start
   ```

The frontend runs at `http://localhost:3000`. The PHP API is served by Laragon
at `http://localhost/web-resmi-fpg/server/api` and uses the `fpg_properties`
database with Laragon's default local `root` account.

### Production contact form

The contact form stores every valid submission in MySQL before sending its
notification email. Production email is sent through Resend and bot protection
uses Cloudflare Turnstile.

1. Copy `server/.env.example` to `server/.env` on the hosting server.
2. Set `APP_ENV=production`, `APP_URL`, the database credentials, the Resend API
   key, a verified `MAIL_FROM` address, `CONTACT_MAIL_TO`, and the Turnstile
   secret and hostname.
3. Copy `client/.env.example` to `client/.env.production`. Set the public API URL
   and Turnstile site key before running `npm.cmd run build`.
4. For a database created with an older schema, run
   `database/migrations/001_contact_workflow.sql` once. New installations only
   need `database/schema.sql`.
5. Serve the React `client/build` directory through HTTPS and keep Apache
   `AllowOverride All` enabled so the included `.htaccess` protections apply.

Never commit either environment file. If the host uses Nginx, deny access to
dotfiles and prevent PHP execution inside `server/uploads` in its server
configuration.

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
