export type ClothingItem = {
  type: string;
  name: string;
  price: number;
  imageUrl: string;
  buyUrl: string;
}

export type OutfitResult = {
  id: string;
  title: string;
  totalCost: number;
  items: ClothingItem[];
  saved?: boolean;
}

export type UserProfile = {
  location: string;
  gender: 'men' | 'women' | 'unisex';
  age: number;
  height: number;
  heightUnit: 'cm' | 'ft';
  budget: number;
  style: 'old-money' | 'grunge' | 'drill' | 'sport' | 'casual' | 'opium';
}

export type AppStep = 'form' | 'upload' | 'results';
