export type TokensResponse = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  username: string;
  sub: number; // user id
};
