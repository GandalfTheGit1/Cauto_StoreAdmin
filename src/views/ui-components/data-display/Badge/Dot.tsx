import { HiOutlineUser } from 'react-icons/hi'

import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'

const Dot = () => {
  return (
    <div className='flex'>
      <Badge className='mr-4'>
        <Avatar icon={<HiOutlineUser />} />
      </Badge>
    </div>
  )
}

export default Dot
