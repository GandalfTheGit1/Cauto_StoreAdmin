import { useState } from 'react'
import type { MouseEvent } from 'react'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'

import Input from '@/components/ui/Input'

const PasswordVisible = () => {
  const [pwInputType, setPwInputType] = useState('password')

  const onPasswordVisibleClick = (e: MouseEvent) => {
    e.preventDefault()
    setPwInputType(pwInputType === 'password' ? 'text' : 'password')
  }

  const inputIcon = (
    <span className='cursor-pointer' onClick={e => onPasswordVisibleClick(e)}>
      {pwInputType === 'password' ? <HiOutlineEyeOff /> : <HiOutlineEye />}
    </span>
  )

  return (
    <div>
      <Input type={pwInputType} suffix={inputIcon} placeholder='Password' />
    </div>
  )
}

export default PasswordVisible
