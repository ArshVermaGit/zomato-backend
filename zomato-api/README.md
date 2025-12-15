# 🔌 Zomato Backend API

The powerful and scalable backend infrastructure powering the Zomato Ecosystem. Built with NestJS and PostgreSQL.

## ✨ Features

- **Authentication**: Secure JWT-based auth for Customers, Drivers, Restaurants, and Admins.
- **Geospatial Queries**: Efficient location-based searching for nearby restaurants and driver tracking (PostGIS).
- **Real-time Engine**: Socket.IO integration for live order status updates and driver location broadcasting.
- **Payment Processing**: Secure integration with payment gateways (Stripe/Razorpay) including webhooks.
- **Media Management**: Cloud-based image upload and optimization.
- **Role-Based Access Control (RBAC)**: Granular permissions for different user types.

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis
- **Validation**: class-validator / class-transformer
- **Documentation**: Swagger (OpenAPI)
- **Testing**: Jest / Supertest

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (running locally or cloud)
- Redis

### Installation

1.  **Navigate to the api directory**
    ```bash
    cd backend/zomato-api
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file based on `.env.example` and configure your database credentials.

4.  **Database Migration**
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the Server**
    ```bash
    # Development
    npm run start:dev
    
    # Production
    npm run start:prod
    ```

## 📖 API Documentation

Once the server is running, you can access the full Swagger documentation at:

```
http://localhost:3000/api
```

## 👨‍💻 Author

**Arsh Verma** - *Full Stack Developer*

Connect with me:

- 🐙 **GitHub**: [ArshVermaGit](https://github.com/ArshVermaGit)
- 💼 **LinkedIn**: [arshvermadev](https://www.linkedin.com/in/arshvermadev/)
- ✖️ **X (Twitter)**: [@TheArshVerma](https://x.com/TheArshVerma)
- 📧 **Email**: [Arshvermadev@gmail.com](mailto:Arshvermadev@gmail.com)

---

Made with ❤️ by ArshCreates
