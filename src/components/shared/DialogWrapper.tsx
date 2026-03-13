import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { ReactNode } from 'react'

interface DialogWrapperProps {
  ButtonText?: string
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  children: ReactNode
}

export default function DialogWrapper({
  ButtonText = '',
  setIsOpen,
  isOpen,
  children,
}: DialogWrapperProps) {
  const openDialog = () => setIsOpen(true)

  const onDialogClose = () => setIsOpen(false)

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        {children}
      </Dialog>
      <Button variant='solid' onClick={() => openDialog()}>
        {ButtonText}
      </Button>
    </>
  )
}
