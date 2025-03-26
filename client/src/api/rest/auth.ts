import request from '../config';

import type { AxiosPromise } from 'axios';
import type { TokenResponse } from '../types/response.types';
import type { UserCredentials } from '../types/request.types';

export function register(data: UserCredentials): AxiosPromise<TokenResponse> {
  return request({
    url: `/auth/register`,
    method: 'POST',
    data,
  });
}

export function login(data: UserCredentials): AxiosPromise<TokenResponse> {
  return request({
    url: `/auth/login`,
    method: 'POST',
    data,
  });
}

export function refresh(refreshToken: string): AxiosPromise<TokenResponse> {
  return request({
    url: `/auth/refresh`,
    method: 'POST',
    data: refreshToken,
  });
}
