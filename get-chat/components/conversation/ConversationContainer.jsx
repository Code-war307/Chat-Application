import { Card } from '../ui/card'
const ConversationContainer = ({children}) => {
  return (
    <Card className={'w-full h-[calc(100svh-16px)] lg:h-full lg:relative p-1 flex flex-col gap-2 bg-itemListColor border-none'}>
        {children}
    </Card>
  )
}

export default ConversationContainer
