 <!-- E-Commerce Backend API -->

This is a Node.js + Express.js backend built for basic e-commerce functionality, including user authentication, brand management, and product management with Cloudinary integration for image uploads.

---

 <!-- Features -->

- User Registration/Login
- Profile Update with Password, Email & Photo
- Brand CRUD (with categories and logos)
- Product CRUD (with validation under brands/categories)
- Image Uploads via **Cloudinary**
- JWT Authentication Middleware
- Multer for File Upload Handling

---
 <!-- Setup Instructions -->



- Node.js & npm
- MongoDB (local or Atlas)
- Cloudinary account

 <!-- Installation -->

<!-- 1. Clone the Repository** -->
   ```bash
   git clone https://github.com/jobin0007/supporta-backend.git
   cd server

#    Install Dependencies

npm install

# setup .env file
PORT=
MONGO_URI=
JWT_SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_SECRET=
CLOUD_NAME=
NODE_ENV =
ACCESS_SECRET=
REFRESH_SECRET=

# npm run dev to start the server

# API Endpoints

http://localhost:5044/user/register
http://localhost:5044/user/login
http://localhost:5044/user/refreshtoken
http://localhost:5044/user/update-profile
http://localhost:5044/user/delete-profile
http://localhost:5044/user/logout


http://localhost:5044/brand/create-brand
http://localhost:5044/brand/get-all-brand

#  Sample Request (POST /create-brand)
# Form-Data


brandName: Nike
categories: Shoes, Clothing
brandLogo: [image file]






http://localhost:5044/block/block-user/:userId
http://localhost:5044/block/unblock-user/:userId



http://localhost:5044/product/add-product
http://localhost:5044/product/update-product/:id
http://localhost:5044/product/delete-product/:id
http://localhost:5044/product/my-products
http://localhost:5044/product/get-all-products


#  Sample Request (POST /add-product)
# Form-Data

productName: Air Max 270
description: Light, comfortable sneakers
price: 120
brand: Nike
category: Shoes
productImage: [image file]


#  Folder Structure


/controllers
/middleware
/models
/routes
/uploads
.env
server.js






