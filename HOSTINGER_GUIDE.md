# Hostinger Deployment Guide

This guide covers how to deploy the **GamesUp Platform** to Hostinger. The project consists of two parts:
1.  **Frontend**: A React website (built with Vite).
2.  **Backend**: A Node.js API server (Express) connected to a MySQL database.

---

## Part 1: Database Setup (MySQL)

1.  Log in to **Hostinger hPanel**.
2.  Go to **Databases** -> **Management**.
3.  Create a New Database:
    *   **MySQL Database Name**: e.g., `u123456789_gamesup`
    *   **MySQL Username**: e.g., `u123456789_admin`
    *   **Password**: *Create a strong password and save it.*
4.  Click **Enter phpMyAdmin** for the new database.
5.  Click the **Import** tab.
6.  Choose the file `server/schema.sql` from your project folder.
7.  Click **Go** to import the database structure.

---

## Part 2: Backend Deployment (Node.js)

Hostinger supports Node.js on VPS plans (recommended) and some Shared Hosting plans.

### Option A: Shared Hosting (hPanel)

1.  In hPanel, go to **Advanced** -> **Node.js**.
2.  **Create Application**:
    *   **Node.js Version**: Choose **18** or higher (match your local version if possible).
    *   **Application Mode**: Production.
    *   **Application Root**: `server` (or whatever folder you upload to).
    *   **Application URL**: Choose a subdomain (e.g., `api.yourdomain.com`) or subfolder (e.g., `yourdomain.com/api`). *Subdomain is recommended.*
    *   **Application Startup File**: `index.js`
3.  Click **Create**.
4.  **Upload Files**:
    *   Use **File Manager** or FTP.
    *   Navigate to the folder you defined as **Application Root**.
    *   Upload all files from your local `server` folder **EXCEPT** `node_modules`.
    *   *Tip: Zip the `server` folder contents, upload the zip, and extract it.*
5.  **Configure Environment**:
    *   In the Node.js settings in hPanel, look for "Environment Variables" or create a `.env` file in the Application Root.
    *   Add the following variables (update with your database details):
        ```env
        PORT=3001
        DB_HOST=localhost
        DB_USER=u123456789_admin
        DB_PASSWORD=your_db_password
        DB_NAME=u123456789_gamesup
        JWT_SECRET=your_secure_random_secret
        CORS_ORIGIN=https://yourdomain.com
        ```
6.  **Install Dependencies**:
    *   In the Node.js settings, click the **NPM Install** button. This installs packages from `package.json`.
7.  **Start the Server**:
    *   Click **Restart** or **Start**.
    *   Note your API URL (e.g., `https://api.yourdomain.com`).

---

## Part 3: Frontend Deployment (React)

1.  **Prepare for Build**:
    *   Open your local `.env` file (or create `.env.production`).
    *   Add the `VITE_API_URL` variable pointing to your **Backend URL** from Part 2.
    *   *Example*:
        ```env
        VITE_API_URL=https://api.yourdomain.com/functions/v1/make-server-f6f1fb51
        ```
        *(Note: Check your `server/index.js` or `src/utils/supabase/info.tsx` for the exact function name if it differs from `make-server-f6f1fb51`. The default path in `server/index.js` uses `process.env.VITE_SUPABASE_FUNCTION_NAME` or defaults to that string.)*

2.  **Build the Project**:
    *   Open your terminal in the project root.
    *   Run:
        ```bash
        npm run build
        ```
    *   This creates a `dist` (or `build`) folder with your static website files.

3.  **Upload to Hostinger**:
    *   In hPanel, go to **File Manager**.
    *   Navigate to `public_html`.
    *   Delete the default `default.php` if present.
    *   Upload the **contents** of your local `dist` (or `build`) folder.
    *   *You should see `index.html`, `assets/`, etc., directly inside `public_html`.*

4.  **Verify**:
    *   Visit your domain (e.g., `https://yourdomain.com`).
    *   Test the login or products page to ensure it connects to the backend.

---

## Troubleshooting

*   **API Connection Failed**: Check the Network tab in your browser developer tools (F12). If requests are going to `localhost`, you didn't set `VITE_API_URL` correctly before building. If they go to the right URL but fail, check the Backend logs in Hostinger.
*   **404 on Refresh**: If you visit a page like `/products` and refresh, you might get a 404. You need to configure a `.htaccess` file in `public_html` for React Router.

### Create a `.htaccess` file in `public_html`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```
