import { apiCreateAttribute } from '@/services/inventory/AttributeService'

import FormDialog from './index'

export default function CreateAtributeElement() {
  return (
    <FormDialog
      apiService={apiCreateAttribute}
      defaultValue={{ name: '', value: [] }}
      ButtonText='Crear Variacion'
    />
  )
}
