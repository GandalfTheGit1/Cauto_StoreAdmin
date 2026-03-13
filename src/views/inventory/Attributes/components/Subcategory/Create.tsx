import { apiCreateSubcategory } from '@/services/inventory/SubcategoryService'

import FormDialog from './index'

export default function CreateSubcategoryElement() {
  return (
    <FormDialog apiService={apiCreateSubcategory} defaultValue={{ name: '' }} />
  )
}
