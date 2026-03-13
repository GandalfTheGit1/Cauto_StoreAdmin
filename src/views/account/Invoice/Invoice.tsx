import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'

import InvoiceContent from './components/InvoiceContent'

const Invoice = () => {
  return (
    <Container className='h-full'>
      <Card className='h-full' bodyClass='h-full'>
        <InvoiceContent />
      </Card>
    </Container>
  )
}

export default Invoice
