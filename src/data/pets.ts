import pet1 from "../assets/pet1.png";
import pet2 from "../assets/pet2.png";
import pet3 from "../assets/pet3.png";

export type Pet = {
  id: string;
  name: string;
  src: string;
  price: number;
};

export const PETS: Pet[] = [
  { id: "none", name: "None", src: "", price: 0 },
  { id: "pet1", name: "Cat", src: pet1, price: 60 },
  { id: "pet2", name: "Dog", src: pet2, price: 80 },
  { id: "pet3", name: "Bird", src: pet3, price: 100 },
];
