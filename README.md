# Admin Dashboard - Frontend

This is the Vue 3 + Vite frontend for the Admin Dashboard.

## Setup

1.  **Install Dependencies**:

    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory:

    ```env
    VITE_API_URL=https://egypt-post-452k34bh1-mido091s-projects.vercel.app/api
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Testing Checklist

### 1. Authentication

- **Login**: Go to `/login`. Enter username and password.
- **Expected**: Redirect to `/dashboard`.

### 2. Add User (Owner Only)

- **Navigate**: Go to **Users** (`/dashboard/users`).
- **Action**: Click **Add User**.
- **Input**: Enter `username` and `password`.
- **Submit**: Click **Save**.
- **Expected**:
  - Modal closes.
  - Success toast appears (Arabic).
  - New user appears in the list with role **Admin**.

### 3. Add Office (Post Office)

- **Navigate**: Go to **Post Offices** (`/dashboard/posts`).
- **Action**: Click **Add New Office**.
- **Input**:
  - Name: "Cairo Main Office"
  - Governorate: Select from dropdown (populated from existing data).
  - City: "Cairo"
  - Address: "Ataba Square"
  - Map Link: Paste a Google Maps link (e.g., `https://www.google.com/maps/@30.0444,31.2357,15z`).
- **Verification**:
  - Latitude (y) and Longitude (x) fields should auto-populate.
  - Map preview should update to show the location.
- **Submit**: Click **Save**.
- **Expected**: Success toast and new office in list.

### 4. Settings

- **Navigate**: Go to **Settings** (`/dashboard/settings`).
- **Google Ads**: Paste a script tag in the "Google Ads Script" field. Save. Refresh to verify.
- **Logos**: Upload a Light and Dark logo.
- **Main Office**: Update Main Office Location details.

### 5. i18n & Theme

- **Language**: Click the language toggle in the header.
  - **Expected**: UI flips (RTL/LTR) and text changes instantly.
- **Theme**: Click the Moon/Sun icon.
  - **Expected**: Dark/Light mode toggles and persists after refresh.
