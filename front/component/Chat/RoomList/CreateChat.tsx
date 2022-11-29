import React, { useState, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const CreateChat = ({ onClose }: { onClose: () => void }) => {
  const [RoomName, setName] = useState<string>("");
  const [RoomPw, setPw] = useState<string>("");
  const router = useRouter();
  const Name = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.trim());
  };

  const Pw = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPw(e.target.value.trim());

  const createRoom = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (RoomPw && RoomPw.length < 4 && RoomPw.length > 1) {
        setPw("");
        return;
      }
      await axios
        .post("/api/chatroom", { chatroomName: RoomName, password: RoomPw })
        .then(async (res) => {
          setName("");
          setPw("");
          return await res.data.chatroomId;
        })
        .then((chatroomId) => {
          router.push(`/ChatRoom/${chatroomId}`);
          console.log(`we move to /ChatRoom/${chatroomId}`);
        })
        .catch((error) => {
          console.dir(error);
          alert("We have already same room name");
        })
        .finally(() => {
          onClose();
        });
    },
    [RoomName, RoomPw]
  );

  const cancelRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClose();
  };

  return (
    <div className="box">
      <div className="title">
        <h2>Create Chat Room</h2>
      </div>
      <form method="post">
        <div className="submitform">
          <label>name</label>
          <div>
            <input
              onChange={Name}
              autoComplete="username"
              value={RoomName}
              type="text"
            />
          </div>
          <label>password</label>
          <div>
            <input
              onChange={Pw}
              value={RoomPw}
              type="password"
              autoComplete="current-password"
              placeholder="for private room (more than 4 caracters)"
            />
          </div>
        </div>
        <div className="buttonDiv">
          <button type="submit" onClick={createRoom} className="ok">
            OK
          </button>
          <button type="submit" onClick={cancelRoom} className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <style jsx>{`
        .box {
          position: fixed;
          top: 30%;
          left: 33%;

          width: 500px;
          height: 300px;

          background-color: white;
          border: 1px inset black;
          box-shadow: 10px 10px;
          text-transform: uppercase;
        }
        .title {
          padding-left: 10px;
          background-color: black;
          color: white;
        }
        .submitform {
          // background-color: yellow;
          padding-left: 50px;
          padding-top: 20px;
        }
        input {
          // background-color: tomato;
          font-family: "Fragment Mono", monospace;
          width: 400px;
          height: 30px;
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 2px solid black;
          outline: none;
          margin-bottom: 20px;
        }
        input::placeholder {
          color: red;
        }
        button {
          text-align: center;
          padding-top: 30px;
        }
        .buttonDiv {
          // background-color: yellow;
          text-align: center;
        }
        .ok {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          color: white;
          background-color: black;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
        .cancel {
          font-family: "Fragment Mono", monospace;
          font-size: 20px;
          padding: 10px 20px;
          border: 1px solid black;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CreateChat;
