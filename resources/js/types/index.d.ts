import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
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
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
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
    image?: string;
    unitId?: number;
    unit?: Unit;
    categoryId?: number;
    category?: Category;
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
    vehicleBrandId: number;
    vehicle_brand?: VehicleBrand;
}
