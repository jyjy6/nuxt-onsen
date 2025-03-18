export interface UserInfo {
  _id?: string;
  userId: string;
  username: string;
  name: string;
  email: string;
  role: string;
  profileImage: string;
  phone: string;
  address: {
    country: string;
    mainAddress: string;
    subAddress: string;
  };
  lastLogin: string;
}
