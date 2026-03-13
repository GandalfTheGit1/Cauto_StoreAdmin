import {
  HiOutlineLogin,
  HiOutlineDocumentSearch,
  HiOutlineClipboardCheck,
} from 'react-icons/hi'

import Spinner from '@/components/ui/Spinner'
import Steps from '@/components/ui/Steps'

const CustomIcon = () => {
  return (
    <div>
      <Steps current={1}>
        <Steps.Item title='Login' customIcon={<HiOutlineLogin />} />
        <Steps.Item title='Order Placed' customIcon={<Spinner />} />
        <Steps.Item
          title='In Review'
          customIcon={<HiOutlineDocumentSearch />}
        />
        <Steps.Item title='Approved' customIcon={<HiOutlineClipboardCheck />} />
      </Steps>
    </div>
  )
}

export default CustomIcon
