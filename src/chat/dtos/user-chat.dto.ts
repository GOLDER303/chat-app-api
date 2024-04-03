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
    seen: boolean;
    createdAt: Date;
  };
  users: {
    id: number;
    username: string;
  }[];
}
