export default interface Realm {
  id: string;
  name: string;
  slot: number;
  readKey: string;
  authKey: string;
  updateKey: string;
  publicKey: string;
  privateKey: string;
}