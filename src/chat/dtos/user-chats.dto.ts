export interface UserChatDTO {
  id: number;
  chatName: string;
  lastMessage: {
    senderId: number;
    content: string;
  };
  users: {
    username: string;
  }[];
}
