import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'
import { createMemoizedSelector, createCachedSelector } from '../utils/performanceUtils'

// Basic selectors
const selectProducts = (state: RootState) => state.products

// Memoized selectors for inventory operations
export const selectSelectedProducts = createSelector(
  [selectProducts],
  (products) => products.productsSelected
)

export const selectSelectedOffers = createSelector(
  [selectProducts],
  (products) => products.offersSelected
)

export const selectCartTotal = createMemoizedSelector(
  createSelector(
    [selectSelectedProducts, selectSelectedOffers],
    (products, offers) => {
      const productTotal = products.reduce((total, product) => {
        return total + (product.price * (product.quantity || 1))
      }, 0)
      
      const offerTotal = offers.reduce((total, offer) => {
        return total + (offer.price * (offer.quantity || 1))
      }, 0)
      
      return productTotal + offerTotal
    }
  ),
  // Custom equality check for cart total (within 0.01 precision)
  (a, b) => Math.abs(a - b) < 0.01
)

export const selectCartItemCount = createSelector(
  [selectSelectedProducts, selectSelectedOffers],
  (products, offers) => {
    const productCount = products.reduce((count, product) => {
      return count + (product.quantity || 1)
    }, 0)
    
    const offerCount = offers.reduce((count, offer) => {
      return count + (offer.quantity || 1)
    }, 0)
    
    return productCount + offerCount
  }
)

export const selectCartSummary = createCachedSelector(
  createSelector(
    [selectCartTotal, selectCartItemCount, selectSelectedProducts, selectSelectedOffers],
    (total, itemCount, products, offers) => ({
      total,
      itemCount,
      productCount: products.length,
      offerCount: offers.length,
      isEmpty: itemCount === 0,
      averageItemValue: itemCount > 0 ? total / itemCount : 0,
      hasProducts: products.length > 0,
      hasOffers: offers.length > 0,
    })
  ),
  'cart-summary',
  60000 // 1 minute cache for cart summary
)

// Enhanced inventory analytics
export const selectInventoryAnalytics = createCachedSelector(
  createSelector(
    [selectSelectedProducts, selectSelectedOffers],
    (products, offers) => {
      const allItems = [...products, ...offers]
      
      if (allItems.length === 0) {
        return {
          totalValue: 0,
          averagePrice: 0,
          priceRange: { min: 0, max: 0 },
          categoryDistribution: {},
          topItems: [],
        }
      }
      
      const totalValue = allItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
      const averagePrice = allItems.reduce((sum, item) => sum + item.price, 0) / allItems.length
      const prices = allItems.map(item => item.price)
      const priceRange = { min: Math.min(...prices), max: Math.max(...prices) }
      
      // Category distribution
      const categoryDistribution = allItems.reduce((acc, item) => {
        const category = item.category || 'Uncategorized'
        acc[category] = (acc[category] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Top items by value
      const topItems = allItems
        .map(item => ({
          ...item,
          totalValue: item.price * (item.quantity || 1)
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5)
      
      return {
        totalValue,
        averagePrice,
        priceRange,
        categoryDistribution,
        topItems,
      }
    }
  ),
  'inventory-analytics',
  180000 // 3 minutes cache
)