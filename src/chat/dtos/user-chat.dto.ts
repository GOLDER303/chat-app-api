export interface UserChatDTO {
  id: number;
  chatName: string;
  hasChatImage: boolean;
  lastMessage: {
    id: number;
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
