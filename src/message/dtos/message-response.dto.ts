export interface MessageResponseDTO {
  id: number;
  chatId: number;
  createdAt: Date;
  sender: {
    id: number;
    username: string;
  };
  content: string;
  seenByUsers: { id: number }[];
}
