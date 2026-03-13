import { useState } from 'react'

import AdaptableCard from '@/components/shared/AdaptableCard'
import { injectReducer } from '@/store'

import ProductTableTools from './components/ProductTableTools'
import ProductTable from './components/StoresProductsTable'
import reducer from './store'

injectReducer('salesProductList', reducer)

const ProductList = () => {
  const [selectedProductIds, setSelectedProductIds] = useState([])

  return (
    <AdaptableCard className='h-full' bodyClass='h-full'>
      <div className='lg:flex items-center justify-between mb-4'>
        <h3 className='mb-4 lg:mb-0'>Products</h3>
        <ProductTableTools selectedProductIds={selectedProductIds} />
      </div>
      <ProductTable setSelectedProductIds={setSelectedProductIds} />
    </AdaptableCard>
  )
}

export default ProductList
