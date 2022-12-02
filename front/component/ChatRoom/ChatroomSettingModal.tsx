// 방 관리자일때와 아닐때를 나눠야함.
// 우선 일반적인 경우 -> exit the room 만 기본설정으로

// interface Props {
//   ref: void;
// }

export default function ChatroomSettingModal() {
  return (
    <div className="chatroom-setting">
      <div className="box">
        <h1>Exit the room</h1>
      </div>
      <div className="box">
        <h1>Exit the room</h1>
      </div>
      <style jsx>{`
        .chatroom-setting {
          background-color: gray;
        }
        .box {
          font-family: "Fragment Mono", monospace;
          position: absolute;
          top: 18%;
          left: 57.8%;

          width: 200px;
          height: 47px;

          background-color: white;
          border: 1px inset black;
          text-transform: uppercase;
          cursor: pointer;
        }
        h1 {
          font-size: 20px;
          text-align: center;
          font-weight: bold;
        }
        hr {
        }
      `}</style>
    </div>
  );
}
