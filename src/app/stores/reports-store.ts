import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReportsState {
  favorites: number[]
  addFavorite: (id: number) => void
  removeFavorite: (id: number) => void
  toggleFavorite: (id: number) => void
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      favorites: [],
      addFavorite: (id) =>
        set((state) => ({ favorites: [...state.favorites, id] })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((s) => s !== id),
        })),
      toggleFavorite: (id) =>
        set((state) => {
          const isFavorite = state.favorites.includes(id)
          return {
            favorites: isFavorite
              ? state.favorites.filter((s) => s !== id)
              : [...state.favorites, id],
          }
        }),
    }),
    {
      name: 'reports-storage',
    }
  )
)
