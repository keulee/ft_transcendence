export interface IUserService {
  getCurrentUser(id: number);
  getUserById(id: number);
  updateUserById(id: number);
  // setTwoFactorSecret(secret: string, id: number);
  // createUser(user: UserDto);
  // deleteUser();
}
