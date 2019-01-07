export default interface Realm {
  id: string;
  associationId: string;
  slot: number;
  readKey: string;
  authKey: string;
  updateKey: string;
  publicKey: string;
  privateKey: string;
}