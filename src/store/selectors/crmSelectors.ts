import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/rootReducer'

// For now, CRM data might be handled by RTK Query or other slices
// This is a placeholder for future CRM-specific selectors

export const selectCRMData = createSelector(
  [(state: RootState) => state],
  (state) => {
    // Placeholder - will be implemented when CRM slice is added
    return {
      contacts: [],
      leads: [],
      opportunities: [],
    }
  }
)

export const selectCRMMetrics = createSelector(
  [selectCRMData],
  (crmData) => ({
    totalContacts: crmData.contacts.length,
    totalLeads: crmData.leads.length,
    totalOpportunities: crmData.opportunities.length,
  })
)