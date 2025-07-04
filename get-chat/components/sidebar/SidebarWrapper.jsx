import DesktopNav from './nav/DesktopNav'
import MobileNav from './nav/MobileNav'

const SidebarWrapper = ({children}) => {
  return (
    <div className='h-full w-full p-2 flex flex-col bg-thirdColor lg:flex-row gap-2'>
      <MobileNav/>
      <DesktopNav/>
        <main className='h-[calc(100%-80px)] flex lg:h-full w-full gap-2'>
            {children}
        </main>
    </div>
  )
}

export default SidebarWrapper