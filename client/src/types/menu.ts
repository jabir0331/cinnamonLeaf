// src/types/menu.ts
export interface ApiMenuItem {
  _id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
  status?: string;
  createdAt?: string; 
  updatedAt?: string; 
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
  status: 'Available' | 'Unavailable';
  updatedAt?: string; 
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

export interface CategoryTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}