# Micro Business API Integration

## Overview
The Micro Business app is now fully integrated with a FastAPI backend. All static data has been replaced with API calls, providing a real-time, dynamic application.

## Configuration

### API Configuration File
All API endpoints and utility functions are centralized in `@/config.js`. This file exports:

- **API_ENDPOINTS**: Object containing all API routes
- **API Helper Functions**: Reusable methods for making API calls
- **Module APIs**: Specialized API methods for Orders, Products, Customers, and Dashboard

### Environment Variables
Add the following to `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Note**: The API URL defaults to `http://localhost:8000` if not specified.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new business
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Users & Roles
- `GET /api/users` - Get all users
- `POST /api/users` - Create user (Owner only)
- `PUT /api/users/{id}/role` - Update user role
- `DELETE /api/users/{id}` - Delete user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}` - Update order
- `PATCH /api/orders/{id}` - Update order status
- `DELETE /api/orders/{id}` - Delete order

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer details
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `PATCH /api/products/{id}` - Update product stock
- `DELETE /api/products/{id}` - Delete product

### Dashboard
- `GET /api/dashboard/overview` - Business overview
- `GET /api/dashboard/sales?range=weekly` - Sales analytics
- `GET /api/dashboard/profit` - Profit report

## Usage Examples

### Using Orders API

```javascript
import { ordersAPI } from '@/config';

// Get all orders
const orders = await ordersAPI.getAll();

// Get single order
const order = await ordersAPI.getById(1);

// Create order
const newOrder = await ordersAPI.create({
  customerId: "cust_123",
  products: [{ productId: "prod_1", quantity: 2 }],
  totalPrice: 500,
  status: "pending"
});

// Update order status
await ordersAPI.updateStatus(1, "shipped");

// Delete order
await ordersAPI.delete(1);
```

### Using Products API

```javascript
import { productsAPI } from '@/config';

// Get all products
const products = await productsAPI.getAll();

// Create product
const newProduct = await productsAPI.create({
  name: "T-Shirt",
  price: 250
});

// Update product
await productsAPI.update(1, {
  name: "Updated T-Shirt",
  price: 300
});

// Delete product
await productsAPI.delete(1);
```

### Using Customers API

```javascript
import { customersAPI } from '@/config';

// Get all customers
const customers = await customersAPI.getAll();

// Create customer
const newCustomer = await customersAPI.create({
  name: "Ahmed Ali",
  phone: "01000000000",
  address: "Cairo"
});

// Update customer
await customersAPI.update(1, {
  name: "Ahmed Ibrahim",
  phone: "01111111111"
});
```

### Using Dashboard API

```javascript
import { dashboardAPI } from '@/config';

// Get business overview
const overview = await dashboardAPI.getOverview();

// Get sales analytics
const sales = await dashboardAPI.getSales('weekly');

// Get profit report
const profit = await dashboardAPI.getProfit();
```

## Updated Pages

### 1. Orders Page (`/app/orders/page.jsx`)
- ✅ Replaced static data with API calls
- ✅ Added loading state with spinner
- ✅ Added error handling
- ✅ Real-time order filtering
- ✅ Support for all order statuses

### 2. Products Page (`/app/products/page.jsx`)
- ✅ Replaced static data with API calls
- ✅ Dynamic product creation via API
- ✅ Real-time product editing
- ✅ Real-time product deletion
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback

### 3. Customers Page (`/app/customers/page.jsx`)
- ✅ Replaced static data with API calls
- ✅ Added loading state with spinner
- ✅ Added error handling
- ✅ Real-time customer filtering
- ✅ Dynamic customer display with stats

## Error Handling

All API calls include proper error handling:

```javascript
try {
  const data = await ordersAPI.getAll();
  // Handle data
} catch (err) {
  console.error('Error fetching orders:', err);
  // Show error message to user
}
```

## Loading States

Each page displays a loading spinner while fetching data:

```javascript
{loading && (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
)}
```

## How to Start

1. **Ensure the backend is running:**
   ```bash
   cd API
   python -m uvicorn app:app --reload --port 8000
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   Open [http://localhost:3000](http://localhost:3000)

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Notes

- All API calls include `Content-Type: application/json` header
- The frontend gracefully handles missing API data with loading and error states
- Empty result sets display a "No items found" message
- Toast notifications provide user feedback for CRUD operations
- The app supports both singular and plural field names from API responses

## Future Enhancements

- [ ] Add authentication tokens (JWT)
- [ ] Implement refresh tokens
- [ ] Add request caching
- [ ] Add request/response interceptors
- [ ] Add API rate limiting
- [ ] Add offline mode support
- [ ] Add WebSocket support for real-time updates

## Troubleshooting

### API Connection Issues
- Check if the backend is running on `http://localhost:8000`
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for detailed error messages

### CORS Issues
- Ensure the backend has CORS enabled
- Check that the origin is allowed in the backend configuration

### Data Not Loading
- Check the browser's Network tab to see API requests
- Verify the API endpoint URLs match the backend routes
- Check the backend console for server-side errors

---

**Last Updated**: June 2, 2026
**Status**: ✅ Fully Integrated
