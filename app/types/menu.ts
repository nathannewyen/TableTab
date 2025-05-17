export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  imgUrl: string;
  menuItems: MenuItem[];
} 