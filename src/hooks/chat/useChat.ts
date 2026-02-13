import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ChatFormValidator, type ChatFormData } from "./chatFormValiator";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageType, type Message } from "../../types/chat.type";
import { useAuthUser } from "../auth/useAuthUser";

const useChat = () => {
  // TODO: Implement chat hook
  const [messages, setMessages] = useState<Message[]>([]);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const user = useAuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatFormData>({
    resolver: zodResolver(ChatFormValidator.validate()),
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");

    ws.current = socket;

    socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
      if (data.type === MessageType.UserJoined) {
        setIsJoin(true);
      }
    };

    socket.onclose = () => {
      console.log("Disconnected from WebSocket");
      // ws.current = null;
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      // ws.current = null;
    };

    return () => {
      socket.close();
      ws.current = null;
    };
  }, []);

  const sendMessage = (message: string) => {
    ws.current?.send(JSON.stringify({ type: "Chat", message }));
  };

  const setUsername = (formData: ChatFormData) => {
    ws.current?.send(
      JSON.stringify({
        type: "Join",
        username: user?.name || formData.username,
      }),
    );
  };

  return {
    // Chat state and handlers will be implemented here
    messages,
    sendMessage,
    setUsername,
    register,
    handleSubmit,
    errors,
    isJoin,
  };
};

export default useChat;
