export interface Store {
  dispatch: (action: { type: string }) => void;
  page?: {
    createdAt: Date;
    updatedAt: Date;
  };
  socket: {
    connecting: boolean;
  };
}
