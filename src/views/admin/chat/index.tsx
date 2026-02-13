import { useEffect, useRef, useState, type FC } from "react";
import SidebarMenu from "../../../components/SidebarMenu";
import useChat from "../../../hooks/chat/useChat";
import type { Message } from "../../../types/chat.type";
import UserChat from "./ components/UserChat";
const ChatView: FC = () => {
  const [text, setText] = useState<string>("");

  const {
    messages,
    sendMessage,
    register,
    handleSubmit,
    errors,
    setUsername,
    isJoin,
  } = useChat();

  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scrolling to bottom when messages updated
    chatListRef.current?.scrollTo({
      top: chatListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="mt-5 mb-5">
      <div className="row">
        <div className="col-md-3">
          <SidebarMenu />
        </div>
        <div className="col-md-9">
          <div className="card border-0 rounded-4 shadow-sm">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div className="fw-bold">Chat</div>
              </div>
            </div>
            <div
              className="card-body"
              style={{ minHeight: 350, position: "relative" }}
            >
              {!isJoin ? (
                <div>
                  <form
                    className="row g-3"
                    onSubmit={handleSubmit(setUsername)}
                  >
                    <div className="mb-3">
                      <label
                        htmlFor="name"
                        className="form-label fw-bold d-flex justify-content-start"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("username")}
                        id="name"
                        placeholder="Ex.Arfan"
                      />
                      {errors.username && (
                        <p className="text-danger d-flex justify-content-start">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                    <button className="btn btn-primary" type="submit">
                      Join
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <div
                    className="d-flex flex-column gap-2 px-2 pb-2"
                    style={{
                      position: "absolute",
                      bottom: 80,
                      right: 0,
                      height: 260,
                      width: "100%",
                      overflow: "auto",
                    }}
                    ref={chatListRef}
                  >
                    {messages.map((m: Message) => {
                      // if (m.type === "UserJoined") {
                      //   return <UserList message={m} />;
                      // } else if (m.type === "Chat") {
                      return <UserChat message={m} />;
                      // }
                      // return null;
                    })}
                  </div>
                  <div
                    className="input-group mb-3 mt-3"
                    style={{ position: "absolute", bottom: 0, right: 0 }}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message here"
                      aria-label="Recipient’s username"
                      aria-describedby="button-addon2"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      id="button-addon2"
                      onClick={() => {
                        sendMessage(text);
                        setText("");
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
