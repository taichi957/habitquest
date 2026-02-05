import bg1 from "../assets/bg1.png";
import bg2 from "../assets/bg2.png";
import bg3 from "../assets/bg3.png";
import bg4 from "../assets/bg4.png";
import bg5 from "../assets/bg5.png";
import bg6 from "../assets/bg6.png";

export type Background = {
  id: string;
  name: string;
  src: string;
  price: number;
};

export const BACKGROUNDS: Background[] = [
    { id: "bg1", name: "Forest", src: bg1, price: 0 },
    { id: "bg2", name: "Ocean", src: bg2, price: 50 },
    { id: "bg3", name: "Mountain", src: bg3, price: 100 },
    { id: "bg4", name: "Castle", src: bg4, price: 150 },
    { id: "bg5", name: "Desert", src: bg5, price: 200 }, 
    { id: "bg6", name: "ma vương", src: bg6, price: 250 }, 

];
