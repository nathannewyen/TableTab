export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  imgUrl: string;
  menuItems: MenuItem[];
} 