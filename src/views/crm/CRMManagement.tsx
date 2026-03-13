import { useState } from 'react'

import Card from '@/components/ui/Card'
import Tabs from '@/components/ui/Tabs'

import ContactCrudList from './components/ContactCrudList'

const { TabNav, TabList, TabContent } = Tabs

const CRMManagement = () => {
  const [activeTab, setActiveTab] = useState('contacts')

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList>
            <TabNav value="contacts">Contacts</TabNav>
            <TabNav value="leads">Leads</TabNav>
            <TabNav value="opportunities">Opportunities</TabNav>
          </TabList>
          <div className="mt-6">
            <TabContent value="contacts">
              <ContactCrudList />
            </TabContent>
            <TabContent value="leads">
              <div className="text-center py-8 text-gray-500">
                <h5 className="mb-2">Lead Management</h5>
                <p>Lead management functionality will be implemented here.</p>
                <p className="text-sm">Features: Lead scoring, qualification, conversion tracking</p>
              </div>
            </TabContent>
            <TabContent value="opportunities">
              <div className="text-center py-8 text-gray-500">
                <h5 className="mb-2">Opportunity Management</h5>
                <p>Opportunity management functionality will be implemented here.</p>
                <p className="text-sm">Features: Pipeline management, deal tracking, forecasting</p>
              </div>
            </TabContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}

export default CRMManagement