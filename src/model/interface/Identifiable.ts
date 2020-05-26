export default interface Identifiable {
  id: string;

  // TODO: 論理削除の仕組みを入れたい
  // delete: () => void;
}

export interface UserIdentifiable extends Identifiable {
  userId: string;
}
