export default interface ListType<T> {
  __typename: string;
  totalCount: number;
  results: T[];
}