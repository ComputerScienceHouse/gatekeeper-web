export default interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isStaff: boolean;
  isSuperuser: boolean;
}