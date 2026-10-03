import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { APP_CONFIG } from '../config/app'
import type { RecentlyMadeEntry, ShoppingListItem } from '../types'

interface AppState {
  // My Bar
  selectedIngredients: string[]
  recentlyUsedIngredients: string[]
  addIngredient: (id: string) => void
  removeIngredient: (id: string) => void
  toggleIngredient: (id: string) => void
  setIngredients: (ids: string[]) => void

  // Favorites
  favorites: string[]
  toggleFavorite: (cocktailId: string) => void
  isFavorite: (cocktailId: string) => boolean

  // Recently viewed cocktails
  recentlyViewed: string[]
  addRecentlyViewed: (cocktailId: string) => void

  // Recently made
  recentlyMade: RecentlyMadeEntry[]
  addRecentlyMade: (cocktailId: string) => void

  // Shopping list
  shoppingList: ShoppingListItem[]
  addToShoppingList: (ingredientId: string) => void
  removeFromShoppingList: (ingredientId: string) => void
  toggleShoppingItemPurchased: (ingredientId: string) => void
  clearPurchasedShoppingItems: () => void

  // Mood preferences (session-level, still persisted)
  moodFlavors: string[]
  toggleMoodFlavor: (flavor: string) => void
  clearMoodFlavors: () => void

  // Whether an owned flavor-similar stand-in (src/data/substitutions.ts)
  // counts toward a cocktail's "makeable" status, in addition to always
  // showing as an informational tip. Defaults on: it's what makes "what can
  // I make" reflect what's actually possible behind the bar, and every
  // substituted ingredient is always labeled as such in the UI, never
  // silently merged with an exact match.
  useSubstitutesInMatching: boolean
  toggleUseSubstitutesInMatching: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedIngredients: [],
      recentlyUsedIngredients: [],
      addIngredient: (id) =>
        set((state) => {
          if (state.selectedIngredients.includes(id)) return state
          const recently = [id, ...state.recentlyUsedIngredients.filter((r) => r !== id)].slice(0, 12)
          return {
            selectedIngredients: [...state.selectedIngredients, id],
            recentlyUsedIngredients: recently,
          }
        }),
      removeIngredient: (id) =>
        set((state) => ({
          selectedIngredients: state.selectedIngredients.filter((i) => i !== id),
        })),
      toggleIngredient: (id) => {
        const { selectedIngredients, addIngredient, removeIngredient } = get()
        if (selectedIngredients.includes(id)) removeIngredient(id)
        else addIngredient(id)
      },
      setIngredients: (ids) => set({ selectedIngredients: ids }),

      favorites: [],
      toggleFavorite: (cocktailId) =>
        set((state) => ({
          favorites: state.favorites.includes(cocktailId)
            ? state.favorites.filter((f) => f !== cocktailId)
            : [...state.favorites, cocktailId],
        })),
      isFavorite: (cocktailId) => get().favorites.includes(cocktailId),

      recentlyViewed: [],
      addRecentlyViewed: (cocktailId) =>
        set((state) => ({
          recentlyViewed: [cocktailId, ...state.recentlyViewed.filter((c) => c !== cocktailId)].slice(0, 10),
        })),

      recentlyMade: [],
      addRecentlyMade: (cocktailId) =>
        set((state) => ({
          recentlyMade: [{ cocktailId, madeAt: Date.now() }, ...state.recentlyMade].slice(0, 30),
        })),

      shoppingList: [],
      addToShoppingList: (ingredientId) =>
        set((state) => {
          if (state.shoppingList.some((i) => i.ingredientId === ingredientId)) return state
          return {
            shoppingList: [...state.shoppingList, { ingredientId, purchased: false, addedAt: Date.now() }],
          }
        }),
      removeFromShoppingList: (ingredientId) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((i) => i.ingredientId !== ingredientId),
        })),
      toggleShoppingItemPurchased: (ingredientId) =>
        set((state) => ({
          shoppingList: state.shoppingList.map((i) =>
            i.ingredientId === ingredientId ? { ...i, purchased: !i.purchased } : i,
          ),
        })),
      clearPurchasedShoppingItems: () =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((i) => !i.purchased),
        })),

      moodFlavors: [],
      toggleMoodFlavor: (flavor) =>
        set((state) => ({
          moodFlavors: state.moodFlavors.includes(flavor)
            ? state.moodFlavors.filter((f) => f !== flavor)
            : [...state.moodFlavors, flavor],
        })),
      clearMoodFlavors: () => set({ moodFlavors: [] }),

      useSubstitutesInMatching: true,
      toggleUseSubstitutesInMatching: () =>
        set((state) => ({ useSubstitutesInMatching: !state.useSubstitutesInMatching })),
    }),
    {
      name: `${APP_CONFIG.storagePrefix}-store`,
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persisted) => {
        // v1 -> v2: introduces useSubstitutesInMatching, defaulting to true
        // for both new and pre-existing users. Zustand merges this partial
        // result over the store's defaults, so only the new field matters.
        const state = persisted as Partial<AppState> | undefined
        return { ...state, useSubstitutesInMatching: state?.useSubstitutesInMatching ?? true } as AppState
      },
    },
  ),
)
