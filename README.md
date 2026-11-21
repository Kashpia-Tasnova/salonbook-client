# SalonBook – Blush & Bloom

## Project Name and Description

**SalonBook – Blush & Bloom** is a salon appointment booking web application where customers can explore salon services, book appointments, manage their bookings, and make secure online payments. It also provides an admin dashboard to manage salon services, categories, appointments, users, and transactions.

## Live Website

**Live Website:** https://salonbook-client-six-zeta.vercel.app/

**Backend API:** https://salonbook-server-ydpb.onrender.com

## Important Features

### Customer Features
- Browse all available salon services.
- Search services by name.
- Filter services by category.
- Sort services by price.
- View detailed information about each service.
- Register and sign in using email/password or Google.
- Upload, update, or remove a profile photo.
- Book appointments by selecting a date and available time slot.
- View personal appointments and booking details.
- Cancel pending appointments.
- Pay for confirmed appointments through Stripe Checkout.
- Manage personal profile information.

### Admin Features
- Access a role-based admin dashboard.
- Add, edit, and manage salon services.
- Manage service categories.
- View, confirm, and cancel appointments.
- View and block or unblock users.
- View payment transaction records.
- Manage personal profile information.

### General Features
- Responsive design for mobile, tablet, and desktop.
- Protected routes and role-based access.
- Loading states and skeleton loaders.
- Toast notifications for success and error messages.
- User-friendly error handling.

## Technology Stack

- **Framework:** Next.js (App Router)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Payment Integration:** Stripe Checkout
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **API Communication:** REST API

## Installation Instructions

### 1. Clone the Client Repository

```bash
git clone https://github.com/Kashpia-Tasnova/salonbook-client.git
```

### 2. Navigate to the Project Directory

```bash
cd salonbook-client
```

### 3. Install Dependencies

```bash
npm install
```

## How to Run the Project Locally

### 1. Configure Environment Variables

Create a `.env.local` file in the root directory of the frontend project.

Add the required environment variables:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
```

Set their values according to your local backend configuration. Never commit actual secret values or credential files to GitHub.

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Open the Application

Visit the following URL in your browser:

http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Required Environment Variables

The frontend requires the following environment variables:

| Variable Name | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Better Auth server URL |

**Note:** Add the actual values to your local `.env.local` file. Do not upload environment files or secret values to GitHub.

## Client and Server Repository Links

- **Client Repository:** https://github.com/Kashpia-Tasnova/salonbook-client
- **Server Repository:** https://github.com/Kashpia-Tasnova/salonbook-server

## Author

**SalonBook – Blush & Bloom**