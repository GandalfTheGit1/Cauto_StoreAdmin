import type { ChangeEvent } from 'react'

import Switcher from '@/components/ui/Switcher'

const Basic = () => {
  const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
    console.log(val, e)
  }

  return (
    <div>
      <Switcher defaultChecked onChange={onSwitcherToggle} />
    </div>
  )
}

export default Basic
