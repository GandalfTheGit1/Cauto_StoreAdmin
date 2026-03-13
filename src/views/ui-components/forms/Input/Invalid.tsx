import { useState } from 'react'
import { HiExclamationCircle } from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const Invalid = () => {
  const [invalid, setInvalid] = useState(false)

  return (
    <div>
      <div className='mb-4'>
        <Input
          invalid={invalid}
          placeholder='Invalid input'
          suffix={
            invalid ? (
              <HiExclamationCircle className='text-red-500 text-xl' />
            ) : null
          }
        />
      </div>
      <div className='mb-4'>
        <Input textArea invalid={invalid} placeholder='Invalid text area' />
      </div>
      <Button variant='solid' onClick={() => setInvalid(!invalid)}>
        Set {invalid ? 'Valid' : 'Invalid'}
      </Button>
    </div>
  )
}

export default Invalid
