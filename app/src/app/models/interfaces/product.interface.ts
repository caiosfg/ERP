export interface Product {
  id: number,
  description: string,
  price: string,
  stock: number,
  image: string,
  user_id: {
    id: number,
    email: string,
    name: string
  }
}
