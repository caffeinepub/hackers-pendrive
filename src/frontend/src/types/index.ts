export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image?: string;
  features: string[];
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  buyerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Delivered";
  timestamp: string;
  adminNote?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  text: string;
  timestamp: string;
}

export interface Complaint {
  id: string;
  name: string;
  email: string;
  orderId: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "Open" | "In Review" | "Resolved";
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  createdAt: string;
  orders: string[];
}

export interface CustomerAuthSession {
  customerId: string;
  email: string;
  name: string;
}
