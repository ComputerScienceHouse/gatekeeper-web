import Realm from "./Realm";

export default interface IssueRequest {
  systemSecret: string;
  realms: Realm[];
}