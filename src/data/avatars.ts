import avatar1 from "../assets/avatar1.png";
import avatar2 from "../assets/avatar2.png";
import avatar3 from "../assets/avatar3.png";
import avatar4 from "../assets/avatar4.png";
import avatar5 from "../assets/avatar5.png";
import avatar6 from "../assets/avatar6.png";
import avatar7 from "../assets/avatar7.png";
import avatar8 from "../assets/avatar8.png";
import avatar9 from "../assets/avatar9.png";
import avatar10 from "../assets/avatar10.png";
import avatar11 from "../assets/avatar11.png";
import avatar12 from "../assets/avatar12.png";

export type AvatarItem = {
  id: string;
  name: string;
  src: string;
  price: number;
};

export const AVATARS: AvatarItem[] = [
  { id: "avatar1", name: "Default", src: avatar1, price: 0 },
  { id: "avatar2", name: "Knight", src: avatar2, price: 0 },
  { id: "avatar3", name: "Mage", src: avatar3, price: 80 },
  { id: "avatar4", name: "Dragon", src: avatar4, price: 120 },
  { id: "avatar5", name: "Hunter", src: avatar5, price: 150 },
  { id: "avatar6", name: "Rogue", src: avatar6, price: 200 },
  { id: "avatar7", name: "", src: avatar7, price: 250 },
  { id: "avatar8", name: "", src: avatar8, price: 300 },
  { id: "avatar9", name: "", src: avatar9, price: 350 },
  { id: "avatar10", name: "", src: avatar10, price: 400 },
  { id: "avatar11", name: "", src: avatar11, price: 450 },
  { id: "avatar12", name: "", src: avatar12, price: 500 },
];
