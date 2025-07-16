export type Role = "ADMIN" | "USER";

export interface UserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt?: Date;
}

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public role: Role;
  public createdAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }
}