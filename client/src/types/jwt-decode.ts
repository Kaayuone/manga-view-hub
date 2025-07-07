// <reference path="jwt-decode\build\esm\index.d.ts" />
declare module 'jwt-decode' {
  export interface JwtPayload {
    id: number;
    username: string;
  }
}
