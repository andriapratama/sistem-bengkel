import { LucideIcon } from 'lucide-react';

import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    admin: Admin;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Admin {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
}

export interface Unit {
    id: number;
    name: string;
    code: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    stock: number;
    cost: number;
    price: number;
    status: boolean;
    hasVariant: boolean;
    image?: string;
    image_url?: string;
    quantity?: number;
    unit_id?: number;
    unit?: Unit;
    category_id?: number;
    category?: Category;
    created_at: Date;
    updated_at: Date;
}

export interface Vehicle {
    id: number;
    vehicle_year: string;
    police_number: string;
    last_service_date: Date;
    user_id: number;
    user?: User;
    vehicle_variant_id: number;
    vehicle_variant?: VehicleVariant;
    created_at: Date;
    updated_at: Date;
}

export interface VehicleBrand {
    id: number;
    name: string;
}

export interface VehicleVariant {
    id: number;
    name: string;
    vehicle_brand_id: number;
    vehicle_brand?: VehicleBrand;
}

export interface Cart {
    id: number;
    quantity: number;
    product: Product;
    checked: boolean;
    subtotal?: number;
    isImageError?: boolean;
}

export interface Transaction {
    id: number;
    invoice_number: string;
    payment_method: string;
    payment_status: string;
    shipping_address: string;
    shipping_status: string;
    discount_amount: number;
    total_price: number;
    total_quantity: number;
    grand_total: number;
    user_id: number;
    user: User;
    transaction_items: TransactionItem[];
    payment_image?: string;
    shipping_image?: string;
    updated_at: Date;
    created_at: Date;
    isImageError?: boolean;
}

export interface TransactionItem {
    id: number;
    transaction_id: number;
    price: number;
    product_id: number;
    product: Product;
    quantity: number;
    subtotal: number;
    variant_id: number | null;
    created_at: Date;
    updated_at: Date;
}

export interface Service {
    id: number;
    name: string;
    description?: string;
    estimated_duration?: number;
    estimated_price?: number;
    created_at: Date;
    updated_at: Date;
}
