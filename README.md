# Revalsys Store (Mini Ecommerce Showcase)

Revalsys Store is a mini product showcase web application built with the **Next.js App Router**, **TypeScript**, and **Tailwind CSS**.

It is intentionally **backend-free**:
- Products come from local JSON (`data/products.json`)
- Cart and user profile are persisted using `localStorage`

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Local JSON data (no database / no backend)
- React Context API (cart + user)
- Optional: Razorpay Checkout (server Route Handlers)

## Features

- Home (`/`): hero + featured products
- Products (`/products`):
  - Search with autocomplete suggestions
  - Filter by category
  - Filter by price range (min/max)
  - Responsive product grid
- Product detail (`/products/[id]`): image, price, description, add-to-cart
- Cart (`/cart`):
  - Quantity increase/decrease, remove item, clear cart
  - Total calculation
  - Persistent cart (localStorage)
  - Razorpay payment button (optional)
- Login (`/login`): mock login (name/email), stored in localStorage
- About (`/about`) and Contact (`/contact`)
- SEO: metadata per page (title + description)
- UX: loading skeletons + empty states

## Project Structure

```
/app
  /api               - Razorpay order + signature verify (optional)
  /products          - listing + detail routes
  /cart              - cart route
  /login             - login route
  /about /contact    - static pages
/components
  /providers         - CartProvider + UserProvider (Context)
  /products          - ProductsClient (search/filter UI)
  /cart              - CartClient + AddToCartButton
  /checkout          - RazorpayCheckoutButton (optional)
  /ui                - Button, Input, Container
/data                - products.json
/types               - Product, CartItem, User
/utils               - formatting, products helpers, localStorage helpers
```

## Application Flow (How it works)

### 1) Products (data + images)

- Product catalog is stored in `data/products.json`
- Pages read the catalog using helpers from `utils/products.ts`
- Images are loaded from the `public/` directory using paths like:
  - `/images/earbuds.png`
  - `/products/trail-daypack.svg`

Important: don’t prefix image paths with `public/` in JSON.

### 2) Browsing + Search/Filters (`/products`)

The products page renders a client component: `components/products/ProductsClient.tsx`.

- Search:
  - Typing filters the product list immediately
  - Autocomplete dropdown suggests matching product names
  - Selecting a suggestion fills the input and closes the dropdown
- Filters:
  - Category dropdown filters by product category
  - Price range filters by min/max

### 3) Product detail → Add to cart (`/products/[id]`)

- Product detail page loads a product by id and renders `components/cart/AddToCartButton.tsx`
- Clicking **Add to Cart** updates cart state in the Cart Context provider

### 4) Cart (`/cart`)

Cart is managed by `components/providers/CartProvider.tsx`:

- Actions: add, remove, increase/decrease, clear
- Derived values: total items and subtotal
- Persistence: cart is saved to `localStorage` under `revalsys_cart_v1`

### 5) Login (`/login`)

Login is a UI-only mock (name + email) stored at:

- `localStorage["revalsys_user_v1"]`

Login does **not** affect cart by default (cart is device/browser based).

## LocalStorage Keys

- Cart: `revalsys_cart_v1`
- User: `revalsys_user_v1`

Note: `localStorage` is per-origin. `http://localhost:3000` and `http://<LAN-IP>:3000` do not share storage.

## Razorpay Checkout (Optional)

This project includes a basic Razorpay Standard Checkout integration.

### Setup

1. Copy `.env.example` to `.env.local` (or edit the existing `.env.local`)
2. Fill:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET` (server-side only; never expose it to the client)
3. Restart dev server

### Flow

1. Click **Pay with Razorpay** in the cart (`components/checkout/RazorpayCheckoutButton.tsx`)
2. `POST /api/razorpay/order` creates a Razorpay Order on the server
3. Razorpay Checkout UI opens in the browser
4. After payment, `POST /api/razorpay/verify` verifies the signature server-side
5. On success: cart is cleared and user is redirected to `/checkout/success`

Server routes:
- Create order: `app/api/razorpay/order/route.ts`
- Verify signature: `app/api/razorpay/verify/route.ts`

## Running the Project

Prerequisites: Node.js 18+.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### TypeScript checks

```bash
npm run typecheck
```

## Troubleshooting

- Images not rendering:
  - Ensure the image is inside `public/`
  - Use `/images/xyz.png` (not `public/images/xyz.png`)
- Cart/user storage not showing:
  - Check the same origin in DevTools Application tab (`localhost` vs `LAN IP`)
  - Clear cart: `localStorage.removeItem("revalsys_cart_v1")`

## AI Usage

This project was implemented with assistance from an AI coding agent to speed up scaffolding and UI/state wiring. The final code was iterated and adjusted based on the project requirements and manual validation.
