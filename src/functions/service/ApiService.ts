import UserAuthService from "@/service/UserAuthService";
import { container } from "tsyringe";
import axios from "axios";
import IApiResponse from "../base/IApiResponse";

export namespace api {
  export async function call<T>(name: string, params: any = {}) {
    try {
      const userToken = await container
        .resolve(UserAuthService)
        .getFirebaseUser()
        ?.getIdToken();

      if (!userToken) {
        return null;
      }

      const res = await (async () => {
        try {
          return await axios.get(
            `https://us-central1-cactack-26e4c.cloudfunctions.net/${name}`,
            {
              params: params,
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
        } catch (e) {
          console.log(e);
          return null;
        }
      })();

      return res ? (res.data as IApiResponse<T>) : null;
    } catch (e) {
      return null;
    }
  }
}
