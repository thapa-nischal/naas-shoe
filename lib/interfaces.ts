export type Cart = {
  userId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    imageString: string;
    quantity: number;
  }>;
};