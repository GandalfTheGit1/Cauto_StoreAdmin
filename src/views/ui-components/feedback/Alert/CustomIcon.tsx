import { HiFire } from 'react-icons/hi'

import Alert from '@/components/ui/Alert'

const Icon = () => {
  return (
    <div>
      <Alert showIcon type='success' customIcon={<HiFire />}>
        Additional description and information about copywriting.
      </Alert>
    </div>
  )
}

export default Icon
