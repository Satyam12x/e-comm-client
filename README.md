# E-Commerce Platform - Hardware IT Shop

A full-stack MERN e-commerce platform with admin panel, 3D product viewing, Razorpay payment integration, and comprehensive features.

## Features

### User Features
- 🛒 Browse and search products with filters
- 🎯 3D product viewer for supported items
- 🛍️ Shopping cart with coupon support
- 💳 Secure payment with Razorpay (Trial mode available)
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- 👤 User profile and address management

### Admin Features
- 📊 Comprehensive dashboard with analytics
- 📦 Product management (CRUD with image and 3D model uploads)
- 🎫 Coupon generation and management
- 📋 Order management and tracking
- 📈 Sales analytics with customizable periods
- 👥 User management
- 📸 Cloudinary integration for media

## Tech Stack

### Backend
- **Framework**: Express.js (MVC Architecture)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer + Cloudinary
- **Payment**: Razorpay
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **Compression**: Gzip

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **3D Rendering**: React Three Fiber + Three.js
- **Carousel**: Swiper
- **Icons**: Lucide React

## Project Structure

```
E-Commerce Website/
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── database.js
│   │   ├── logger.js
│   │   └── razorpay.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── upload.js
│   │   └── validator.js
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── reviewRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── seedAdmin.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductViewer3D.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (optional for images)
- Razorpay account (optional, trial mode available)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/ecommerce

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

ADMIN_EMAIL=admin@hardware-shop.com
ADMIN_PASSWORD=Admin@12345

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_TRIAL_MODE=true

CLIENT_URL=http://localhost:5173
```

4. Seed admin user:
```bash
npm run seed:admin
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item
- `POST /api/cart/coupon/apply` - Apply coupon

### Orders
- `POST /api/orders/create` - Create order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Coupons
- `POST /api/coupons/validate` - Validate coupon
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons` - Create coupon (Admin)
- `POST /api/coupons/generate` - Generate random coupon (Admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/analytics/sales` - Sales analytics
- `GET /api/admin/analytics/products` - Product analytics
- `GET /api/admin/orders/:orderId/logs` - Order logs

## Features Details

### Payment Integration
- Razorpay integration for secure payments
- Trial mode for testing without credentials
- Automatic order status updates
- Payment verification with signature

### 3D Product Viewer
- Upload GLB/GLTF models for products
- Interactive 3D viewer with orbit controls
- Zoom and rotate functionality
- Fallback to images if 3D not available

### Coupon System
- Percentage or fixed discounts
- Minimum order amount
- Usage limits
- Expiration dates
- User-specific usage tracking

### Order Tracking
- Multiple status stages
- Status history
- Tracking information
- Estimated delivery dates

## Development Guidelines

### Code Quality
- No comments in code (self-documenting code)
- Clean and optimized code
- MVC pattern strictly followed
- Professional error handling
- Comprehensive logging

### Security
- Helmet for security headers
- Rate limiting
- CORS configuration
- JWT authentication
- Password hashing with bcrypt

### Performance
- Compression middleware
- Image optimization via Cloudinary
- Efficient database queries
- Pagination for large datasets
- Caching strategies

## Deployment

### Backend Deployment (Recommended: Railway, Render, or Heroku)
1. Set environment variables
2. Ensure MongoDB Atlas connection
3. Configure Cloudinary
4. Set up Razorpay production keys
5. Deploy

### Frontend Deployment (Recommended: Vercel or Netlify)
1. Build production bundle: `npm run build`
2. Deploy `dist` folder
3. Configure environment variables
4. Set up redirects for SPA

## Testing

### Backend Testing
```bash
# Install MongoDB and start
mongod

# Run server
npm run dev

# Test endpoints using Thunder Client or Postman
```

### Frontend Testing
```bash
# Start development server
npm run dev

# Test user flows manually
```

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGO_URI in .env
- Verify network connection

**Cloudinary Upload Fails**
- Verify credentials in .env
- Check file size (max 10MB)
- Ensure file format is supported

**Payment in Trial Mode**
- Set RAZORPAY_TRIAL_MODE=true
- No actual payment will be processed
- Use for development/testing

**3D Model Not Loading**
- Check file format (GLB/GLTF only)
- Verify Cloudinary upload
- Check browser console for errors

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
