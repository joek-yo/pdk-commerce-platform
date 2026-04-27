// FILE: src/lib/deliveryZones.ts

export interface DeliveryZone {
  name: string;
  fee: number;
  keywords: string[];
}

export const deliveryZones: DeliveryZone[] = [
  {
    name: "Nairobi",
    fee: 200,
    keywords: ["nairobi", "westlands", "kileleshwa", "karen", "lavington", "kangemi"],
  },
  {
    name: "Kiambu",
    fee: 250,
    keywords: ["kiambu", "ruaka", "ridgeways", "banana hill"],
  },
  {
    name: "Thika",
    fee: 300,
    keywords: ["thika", "makongeni", "gatuanyaga"],
  },
  {
    name: "Juja",
    fee: 300,
    keywords: ["juja", "juja farm", "jkuat"],
  },
];