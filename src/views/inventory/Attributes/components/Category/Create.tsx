import { apiCreateCategory } from '@/services/inventory/CategoryService'

import FormDialog from '../Form'

export default function CreateCategoryElement() {
  return <FormDialog apiService={apiCreateCategory} defaultValue='' />
}
