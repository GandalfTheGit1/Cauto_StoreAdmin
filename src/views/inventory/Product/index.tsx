import { lazy } from 'react'

// Lazy load Product components for better performance
const ProductManagement = lazy(() => import('./ProductManagement'))
const ProductList = lazy(() => import('./ProductList'))
const ProductForm = lazy(() => import('./ProductForm'))
const ProductNew = lazy(() => import('./ProductNew'))
const ProductEdit = lazy(() => import('./ProductEdit'))

const Product = () => {
  return <ProductManagement />
}

export default Product
export { ProductManagement, ProductList, ProductForm, ProductNew, ProductEdit }