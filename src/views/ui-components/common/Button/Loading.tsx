import { useState } from 'react'
import { HiPhone } from 'react-icons/hi'

import Button from '@/components/ui/Button'

const Loading = () => {
  const [loading, setLoading] = useState(false)

  const onClick = () => {
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }

  return (
    <div className='flex-wrap inline-flex xl:flex items-center gap-2'>
      <Button loading>Loading</Button>
      <Button loading shape='circle' icon={<HiPhone />} />
      <Button variant='solid' loading={loading} onClick={onClick}>
        Click Me!
      </Button>
    </div>
  )
}

export default Loading
