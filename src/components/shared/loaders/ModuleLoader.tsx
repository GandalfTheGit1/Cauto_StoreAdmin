import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import { Card } from '@/components/ui'

interface ModuleLoaderProps {
  children: React.ReactNode
  moduleName?: string
}

const ModuleLoadingFallback = ({ moduleName }: { moduleName?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loading loading={true} spinnerClass="text-primary" />
      {moduleName && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading {moduleName} module...
        </p>
      )}
    </div>
  )
}

const ModuleLoader = ({ children, moduleName }: ModuleLoaderProps) => {
  return (
    <Suspense fallback={<ModuleLoadingFallback moduleName={moduleName} />}>
      {children}
    </Suspense>
  )
}

export default ModuleLoader