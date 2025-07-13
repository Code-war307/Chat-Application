import Image from 'next/image'

const PageNotBuild = ({query}) => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center gap-5
    '>
        <div className='h-60 w-60 relative'>
            <Image src={'/error/road-block.png'} fill className='object-contain' alt='page not build'/>
        </div>
        <div className='text-2xl text-white font-semibold'>{query}</div>
    </div>
  )
}

export default PageNotBuild