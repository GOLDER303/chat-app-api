export interface UserChatDTO {
  id: number;
  chatName: string;
  lastMessage: {
    sender: {
      username: string;
    };
    content: string;
  };
  users: {
    id: number;
    username: string;
  }[];
}
