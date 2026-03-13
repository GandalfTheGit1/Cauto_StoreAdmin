import { useState } from 'react'

import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'

import InventoryCrudList from './components/InventoryCrudList'

const { TabNav, TabList, TabContent } = Tabs

const InventoryManagement = () => {
  const [activeTab, setActiveTab] = useState('items')

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <TabNav value="items">Inventory Items</TabNav>
            <TabNav value="movements">Stock Movements</TabNav>
            <TabNav value="suppliers">Suppliers</TabNav>
            <TabNav value="alerts">Stock Alerts</TabNav>
          </TabList>
          <div className="mt-6">
            <TabContent value="items">
              <InventoryCrudList />
            </TabContent>
            <TabContent value="movements">
              <div className="text-center py-8 text-gray-500">
                <h5 className="mb-2">Stock Movements</h5>
                <p>Stock movement tracking functionality will be implemented here.</p>
                <p className="text-sm">Features: Movement history, inbound/outbound tracking, adjustments</p>
              </div>
            </TabContent>
            <TabContent value="suppliers">
              <div className="text-center py-8 text-gray-500">
                <h5 className="mb-2">Supplier Management</h5>
                <p>Supplier management functionality will be implemented here.</p>
                <p className="text-sm">Features: Supplier profiles, performance tracking, purchase orders</p>
              </div>
            </TabContent>
            <TabContent value="alerts">
              <div className="text-center py-8 text-gray-500">
                <h5 className="mb-2">Stock Alerts</h5>
                <p>Stock alert management functionality will be implemented here.</p>
                <p className="text-sm">Features: Low stock alerts, reorder notifications, overstock warnings</p>
              </div>
            </TabContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}

export default InventoryManagement