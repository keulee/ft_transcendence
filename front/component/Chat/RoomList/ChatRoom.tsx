import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Loading from "../../errorAndLoading/Loading";
import fetcher from "../../Utils/fetcher";
import useSocket from "../../Utils/socket";
import { IChatroom } from "../../../interfaceType";
// import EachRoom from "./delete apres";

export default function ChatRoom({ accessToken }: { accessToken: string }) {
  const { data, error } = useSWR(`/api/chatroom`, fetcher);
  const [socket] = useSocket(accessToken, "chat");
  // if (data) {
  //   console.log(data);
  // }

  useEffect(() => {
    socket?.on("newRoomList", (data: string) => {
      console.log(data);
      mutate("/api/chatroom");
    });
    return () => {
      socket?.off("newRoomList");
    };
  }, []);
  if (error) axios.get("/api/auth/refresh").catch((e) => console.log(e));
  if (!data) return <Loading />;
  return (
    <div>
      <div className="list">
        <ul>
          {data.map((room: IChatroom) => {
            return (
              <div key={room.chatroomId} className="room-li">
                {/* link 추가해야함 */}
                <li>{room.chatroomName}</li>
                <img
                  src={
                    room.password
                      ? "/images/private_room.png"
                      : "/images/public_room.png"
                  }
                  width="40px"
                />
              </div>
            );
          })}
        </ul>
      </div>
      <style jsx>{`
        .list {
          height: 300px;
          margin-top: 55px;
        }
        .room-li {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
}
