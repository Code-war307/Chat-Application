import { Card } from '../ui/card'
const ConversationContainer = ({children}) => {
  return (
    <Card className={'w-full h-[calc(100svh-32px)] lg:h-full lg:relative p-2 flex flex-col gap-2 bg-itemListColor border-none'}>
        {children}
    </Card>
  )
}

export default ConversationContainer