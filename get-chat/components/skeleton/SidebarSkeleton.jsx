import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'

const SidebarSkeleton = () => {
  return (
    <Card className={'w-full h-15 p-2 flex flex-row items-center justify-between gap-2 bg-transparent border-none hover:bg-textcolor rounded-lg'}>
        <Skeleton className={'h-full w-14 rounded-full'}/>
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-4 w-50" />
          <Skeleton className="h-3 w-24" />
        </div>
    </Card>
  )
}

export default SidebarSkeleton 