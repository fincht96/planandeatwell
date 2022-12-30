export interface AuthClaims {
  roles: Array<'admin' | 'user'>;
  userId: number;
}
