import AdaptableCard from '@/components/shared/AdaptableCard'

import ProductCrudList from './components/ProductCrudList'

const ProductManagement = () => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <ProductCrudList />
    </div>
  )
}

export default ProductManagement