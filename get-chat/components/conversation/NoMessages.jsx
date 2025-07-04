import { Card } from "../ui/card";

const NoMessages = () => (
  <div className="flex-1 w-full flex flex-col h-4 gap-2 p-3 overflow-y-scroll no-scrollbar items-center justify-center">
    <Card className="flex flex-col items-center justify-center w-full max-w-md h-auto p-8 text-center border-none bg-itemListColor">
      <div className="flex flex-col items-center animate-bounce">
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="40" width="60" height="40" rx="8" fill="#E6F0FA" />
          <rect x="50" y="20" width="20" height="30" rx="6" fill="#A3C8F5" />
          <ellipse cx="60" cy="80" rx="30" ry="6" fill="#F2F6FA" />
          <ellipse cx="60" cy="60" rx="10" ry="6" fill="#fff" />
          <path d="M60 60 Q62 55 65 60 Q68 65 60 60" fill="#A3C8F5" />
          <circle cx="55" cy="60" r="5" fill="#fff" />
          <circle cx="65" cy="60" r="5" fill="#fff" />
          <ellipse cx="55" cy="62" rx="2" ry="1" fill="#A3C8F5" />
          <ellipse cx="65" cy="62" rx="2" ry="1" fill="#A3C8F5" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white">No messages yet</h2>
      <p className="text-muted-foreground text-sm">
        Looks like you haven't initiated a conversation yet.
      </p>
    </Card>
  </div>
);

export default NoMessages;
