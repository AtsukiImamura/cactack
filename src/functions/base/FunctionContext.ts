import * as functions from "firebase-functions";
import admin from "firebase-admin";
import ApiResponse from "./ApiResponse";

export namespace auth {
  export interface ExecutableContext {
    params: any;
    token: admin.auth.DecodedIdToken;
  }

  export function authExecutable(
    onAuthenticated: (context: ExecutableContext) => Promise<any>
  ): (
    req: functions.https.Request,
    res: functions.Response<any>
  ) => Promise<void> {
    return async (
      req: functions.https.Request,
      res: functions.Response<any>
    ) => {
      res.set(
        "Access-Control-Allow-Headers",
        "*" // Authorization, X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept
      );
      res.set("Access-Control-Allow-Origin", "*"); // localhostを許可
      res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS"); // DELETEだけは拒否

      if (req.method.toLowerCase() === "options") {
        res.status(200).send();
        return;
      }

      const token = getIdToken(req);
      if (!token) {
        res
          .status(200)
          .json(
            new ApiResponse(
              403,
              "No bearer token presents on the headers.",
              []
            ).json()
          );
        return;
      }

      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.uid) {
        res
          .status(200)
          .json(new ApiResponse(403, "Can't resolve user id.", []).json());
        return;
      }

      try {
        res
          .status(200)
          .json(
            await onAuthenticated({ token: decodedToken, params: req.query })
          ); // TODO: POSTに対応
      } catch (e) {
        res.status(200).json(new ApiResponse(400, "Internal Error", e).json());
      }
    };
  }

  function getIdToken(request: functions.https.Request) {
    if (!request.headers.authorization) {
      return "";
      // throw new Error('Authorization ヘッダが存在しません。')
    }
    const match = request.headers.authorization.match(/^Bearer (.*)$/);
    if (match) {
      const idToken = match[1];
      return idToken;
    }
    return "";
  }
}
