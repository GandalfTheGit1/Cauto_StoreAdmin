import { HiOutlineUser } from 'react-icons/hi'

import Avatar from '@/components/ui/Avatar'

const Shape = () => {
  return (
    <div className='flex'>
      <Avatar shape='square' className='mr-4' icon={<HiOutlineUser />} />
      <Avatar className='mr-4' icon={<HiOutlineUser />} />
      <Avatar shape='circle' className='mr-4' icon={<HiOutlineUser />} />
    </div>
  )
}

export default Shape
