export interface MessageResponseDTO {
  createdAt: Date;
  sender: {
    username: string;
  };
  content: string;
}
