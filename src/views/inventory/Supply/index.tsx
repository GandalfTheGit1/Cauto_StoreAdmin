import { lazy } from 'react'

// Lazy load Supply components for better performance
const SupplyList = lazy(() => import('./List'))
const SupplyNew = lazy(() => import('./New'))
const SupplyAssociate = lazy(() => import('./Associate'))
const ProductSupply = lazy(() => import('./ProductSupply'))

const Supply = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supply Management</h1>
      <SupplyList />
    </div>
  )
}

export default Supply
export { SupplyList, SupplyNew, SupplyAssociate, ProductSupply }