# EverVow – Wedding Planning Marketplace

EverVow is a wedding planning marketplace that connects customers with wedding service providers through a single platform. Customers can explore wedding services, submit booking requests, and manage their bookings, while vendors can create and manage their services, handle booking requests, and upgrade their subscriptions. Admins can manage users, monitor services, and oversee platform activities.

## ✨ Important Features

### Authentication & Authorization
- Email and password authentication.
- Google social login.
- Role-based dashboards for Admin, Vendor, and Customer.
- Protected routes based on user roles.
- Blocked-user access restriction.

### Customer Features
- Browse and explore wedding services.
- View service details and vendor information.
- Submit wedding service booking requests.
- Manage personal bookings.
- Track booking status.
- Manage customer profile.

### Vendor Features
- Dedicated vendor dashboard.
- Add, edit, and delete wedding services.
- Manage service availability and status.
- View and respond to customer booking requests.
- Accept or reject booking requests.
- Free and Premium subscription plans.
- Stripe-powered subscription payments.
- Manage vendor profile.

### Admin Features
- Admin dashboard with platform statistics.
- View and manage users.
- Block and unblock users.
- Review, approve, and reject submitted services.
- Manage platform services.
- View transaction records.
- Monitor platform activities.

### Additional Features
- Responsive design for mobile, tablet, and desktop.
- Toast notifications for user feedback.
- Image upload using ImgBB.
- Stripe payment integration.
- Custom 404 page.
- Modern and user-friendly interface.

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS
- Shadcn UI
- Lucide React
- Sonner

### Backend
- Node.js
- Express.js
- MongoDB
- Better Auth
- JWT Authentication

### Payment & Other Services
- Stripe
- ImgBB
- Vercel

## 📦 Installation Instructions

### Prerequisites
Make sure you have installed:

- Node.js
- npm
- Git
- MongoDB

### 1. Clone the Client Repository

```bash
git clone https://github.com/samiaforge/EverVow-client.git
```

Navigate to the client folder:

```bash
cd EverVow-client
```

### 2. Install Client Dependencies

```bash
npm install
```

### 3. Clone the Server Repository

Open another terminal:

```bash
git clone https://github.com/samiaforge/EverVow-server.git
```

Navigate to the server folder:

```bash
cd EverVow-server
```

### 4. Install Server Dependencies

```bash
npm install
```


**Note:** Use your own credentials and configure any additional environment variables required by the application. Never commit `.env` or `.env.local` files to GitHub.

## 🚀 How to Run the Project Locally

### Start the Backend Server

Navigate to the server directory:

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal and navigate to the client directory:

```bash
npm run dev
```

The frontend application will run at:

```text
http://localhost:3000
```

Open the frontend URL in your browser to explore EverVow.

## 🌐 Live Website

**Live Website:** https://ever-vow-client.vercel.app/

## 🔗 Repository Links

- **Client Repository:** https://github.com/samiaforge/EverVow-client
- **Server Repository:** https://github.com/samiaforge/EverVow-server

---

Developed as a full-stack wedding planning marketplace project.


