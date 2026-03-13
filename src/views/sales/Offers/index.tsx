import { lazy } from 'react'

// Lazy load Offers components for better performance
const OffersTable = lazy(() => import('./Table'))
const OffersForm = lazy(() => import('./Form'))

const Offers = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Offers Management</h1>
      <OffersTable />
    </div>
  )
}

export default Offers
export { OffersTable, OffersForm }