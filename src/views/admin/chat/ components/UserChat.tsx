import type { FC } from "react";
import { MessageType, type Message } from "../../../../types/chat.type";

const UserChat: FC<{ message: Message }> = ({ message }) => {
  return (
    <div>
      <div
        className="d-flex flex-column gap-1 fst-italic p-2"
        style={{
          width: "100%",
          //   border: "1px solid #000",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(11,17,52,0.2)",
        }}
      >
        <div className="text-black-50 fs-6 d-flex flex-row justify-content-between">
          <div>00:10</div>
          <div>
            {message.username}{" "}
            {message.type === MessageType.UserJoined ? "Joined" : ""}
          </div>
        </div>
        <div className="d-flex flex-row justify-content-start gap-1">
          <div className="fst-normal">
            {message.type === MessageType.Chat ? message.message : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
