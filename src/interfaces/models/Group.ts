import User from './User';

export default interface Group {
  id: string;
  name: string;
  userSet: User[];
}