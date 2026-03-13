import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const Basic = () => {
  const toastNotification = (
    <Notification title='Mesasge'>
      The fat cat sat on the mat bat away with paws annoy owner.
    </Notification>
  )

  function openNotification() {
    toast.push(toastNotification)
  }

  return (
    <div>
      <Button className='mr-2 mb-2' onClick={openNotification}>
        Show toast
      </Button>
    </div>
  )
}

export default Basic
