import { ImSpinner9 } from 'react-icons/im'

import Spinner from '@/components/ui/Spinner'

const CustomIndicator = () => {
  return (
    <div>
      <Spinner size={40} indicator={ImSpinner9} />
    </div>
  )
}

export default CustomIndicator
