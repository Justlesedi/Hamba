export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
};

export type SignInInput = {
  email: string;
  password: string;
};
