import { singleton, container } from "tsyringe";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import IUserRepository from "@/repository/interface/IUserRepository";
import User from "@/model/User";
import JournalDate from "@/model/common/JournalDate";
import IUser from "@/model/interface/IUser";

@singleton()
export default class UserAuthService {
  /**
   * create user with email and password
   * @param email
   * @param password
   */
  public async createUserIfNotExist(email: string, password: string) {
    const info = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    if (!info.user) {
      return;
    }
    const uid = info.user.uid;
    return await this.insertNewUser(
      info.user.displayName ? info.user.displayName : "",
      uid
    );
  }

  private async insertNewUser(name: string, uid: string) {
    return await firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .set(new User(name, uid, JournalDate.today()).simplify());
    // return await container
    //   .resolve<IUserRepository>("UserRepository")
    //   .insert(new User(name, uid, JournalDate.today()));
  }

  /**
   * let user sign in with email and password.
   * @param email
   * @param password
   */
  public signIn(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /** let user sign out */
  public signOut() {
    return firebase.auth().signOut();
  }

  public get userId(): string {
    const fbUser = this.getFirebaseUser();
    return fbUser ? fbUser.uid : "";
  }

  public async getUser(): Promise<IUser | undefined> {
    const fbUser = this.getFirebaseUser();
    if (!fbUser) {
      return undefined;
    }
    return container
      .resolve<IUserRepository>("UserRepository")
      .getByUserId(fbUser.uid);
  }

  public getFirebaseUser(): firebase.User | null {
    // firebase.auth.re
    return firebase.auth().currentUser;
  }

  public async getFirebaseUserLatest(): Promise<firebase.User | null> {
    const user = firebase.auth().currentUser;
    if (!user) {
      return null;
    }
    await user.reload();
    return user;
  }

  public async finishTopIntroduction(): Promise<void> {
    return await this.updateUserInfo("introTopFinished", true);
  }

  public async finishFlowIntroduction(): Promise<void> {
    return await this.updateUserInfo("introFlowFinished", true);
  }

  public async finishBadgetIntroduction(): Promise<void> {
    return await this.updateUserInfo("introBadgetFinished", true);
  }

  public async finishStoreIntroduction(): Promise<void> {
    return await this.updateUserInfo("introStoreFinished", true);
  }

  private async updateUserInfo(key: string, value: any) {
    if (!this.userId) {
      return;
    }
    const target = {};
    (target as any)[key] = value;
    return await firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .update(target);
  }
}
