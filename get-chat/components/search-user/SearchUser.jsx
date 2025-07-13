import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/debounce";
import { useChatStore } from "@/store/useChatStore";

const SearchUser = () => {
  const [isClick, setIsClick] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const { friends, setFilteredFriend } = useChatStore();

  const debounceSearchUser = useDebounce(searchUser, 100);

  useEffect(() => {
    const term = debounceSearchUser.toLowerCase().trim();

    if (term === "") {
      setFilteredFriend(friends);
    } else {
      const filtered = friends.filter((user) =>
        user.username.toLowerCase().includes(term)
      );
      setFilteredFriend(filtered);
    }
  }, [debounceSearchUser, friends, setFilteredFriend]);

  return (
    <>
      <Button onClick={() => setIsClick(!isClick)} className={'bg-transparent hover:bg-sidebarUserHover'}>
        <Search />
      </Button>

      {isClick && (
        <div className="h-full w-full absolute left-0 z-[100] flex items-center gap-2 rounded-lg">
          <input
            type="text"
            placeholder="Search user...."
            className="h-full w-full text-white bg-sidebarUserHover rounded-lg px-3 focus:outline-none"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <Button onClick={() => setIsClick(!isClick)} className={'bg-transparent hover:bg-sidebarUserHover'}>
            <Search />
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchUser;
