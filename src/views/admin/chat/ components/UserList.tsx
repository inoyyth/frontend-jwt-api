import type { FC } from "react";
import type { Message } from "../../../../types/chat.type";

const UserList: FC<{ message: Message }> = ({ message }) => {
  return (
    <div
      className="d-flex justify-content-end align-items-center"
      style={{ position: "absolute", bottom: 80, right: 0 }}
    >
      <div className="d-flex flex-column gap-1 fst-italic">
        <div className="text-black-50 fs-6">00:10</div>
        <div className="d-flex flex-row">
          <div className="fw-bold">{message.username}</div>
          <div className="text-black-50 fs-6">Joined</div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
