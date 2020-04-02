import { singleton } from "tsyringe";
import firebase from "firebase";

@singleton()
export default class UserAuthService {
  /**
   * create user with email and password
   * @param email
   * @param password
   */
  public createUserIfNotExist(email: string, password: string) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        throw new Error(err);
      });
  }

  /**
   * let user sign in with email and password.
   * @param email
   * @param password
   */
  public signIn(email: string, password: string) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }

  /** let user sign out */
  public signOut() {
    return firebase.auth().signOut();
  }

  public get userId(): string {
    const user = firebase.auth().currentUser;
    return user ? user.uid : "";
  }
}
