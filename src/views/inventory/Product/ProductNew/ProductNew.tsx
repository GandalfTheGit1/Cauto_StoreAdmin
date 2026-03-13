import { useNavigate } from 'react-router-dom'

import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { apiProductCreate } from '@/services/SalesService'
import ProductForm, {
  FormModel,
  SetSubmitting,
} from '@/views/inventory/Product/ProductForm'

const ProductNew = () => {
  const navigate = useNavigate()

  const addProduct = async (data: FormModel) => {
    const response = await apiProductCreate(data)
    return response.data
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting
  ) => {
    setSubmitting(true)
    const success = await addProduct(values)
    setSubmitting(false)
    if (success) {
      toast.push(
        <Notification
          title={'Successfuly added'}
          type='success'
          duration={2500}
        >
          Producto Añadido con Éxito
        </Notification>,
        {
          placement: 'top-center',
        }
      )
      navigate('/app/sales/product-list')
    }
  }

  const handleDiscard = () => {
    navigate('/app/sales/product-list')
  }

  return (
    <>
      <ProductForm
        type='new'
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default ProductNew
