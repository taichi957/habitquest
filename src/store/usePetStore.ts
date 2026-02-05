import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PETS } from "../data/pets"; // ✅ IMPORT DIRECTLY

type PetState = {
  unlockedPetIds: string[];
  selectedPet: string;
  unlockPet: (id: string) => void;
  selectPet: (id: string) => void;
  resetPets: () => void;
};

export const usePetStore = create<PetState>()(
  persist(
    (set) => ({
      unlockedPetIds: ["none"],
      selectedPet: "",

      unlockPet: (id) =>
        set((state) => ({
          unlockedPetIds: [...state.unlockedPetIds, id],
        })),

      selectPet: (id) => {
        const pet = PETS.find((p) => p.id === id); // ✅ USE IMPORTED PETS
        if (pet) {
          set({
            selectedPet: pet.src,
          });
        }
      },

      resetPets: () =>
        set({
          unlockedPetIds: ["none"],
          selectedPet: "",
        }),
    }),
    {
      name: "habitquest-pets",
    }
  )
);
