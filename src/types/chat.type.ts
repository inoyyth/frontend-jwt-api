export enum MessageType {
  Join = "Join",
  UserJoined = "UserJoined",
  Chat = "Chat",
}

export type Message = {
  type: MessageType;
  username: string;
  message?: string;
};
