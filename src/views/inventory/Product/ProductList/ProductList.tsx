import AdaptableCard from '@/components/shared/AdaptableCard'
import { injectReducer } from '@/store'

import MainComponent from './components/ProductsTest'
import ProductTable from './components/ProductTable'
import ProductTableTools from './components/ProductTableTools'
import reducer from './store'

injectReducer('salesProductList', reducer)

const ProductList = () => {
  return (
    <AdaptableCard className='h-full' bodyClass='h-full'>
      <div className='lg:flex items-center justify-between mb-4'>
        <h3 className='mb-4 lg:mb-0'>Products</h3>
        <ProductTableTools />
      </div>
      <MainComponent />
    </AdaptableCard>
  )
}

export default ProductList
