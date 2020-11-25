import * as functions from "firebase-functions";
import admin from "firebase-admin";
import ApiResponse from "./ApiResponse";

export namespace auth {
  export interface ExecutableContext {
    params: any;
    token?: admin.auth.DecodedIdToken;
  }

  export class CallableFunction {
    public static auth() {
      return new CallableFunction().auth();
    }

    public static check(
      filter: (context: ExecutableContext) => Promise<boolean> | boolean
    ) {
      return new CallableFunction().check(filter);
    }

    public static execute(exec: (context: ExecutableContext) => Promise<any>) {
      return new CallableFunction().execute(exec);
    }

    private _req?: functions.https.Request;

    private _res?: functions.Response<any>;

    private _token?: admin.auth.DecodedIdToken;

    private _needAuth: boolean = false;

    private _filters: (() => Promise<boolean>)[] = [];

    private get context(): ExecutableContext {
      return { token: this._token, params: this._req ? this._req.query : {} };
    }

    public auth() {
      this._needAuth = true;
      return this;
    }

    private async doAuth(): Promise<boolean> {
      if (!this._needAuth) {
        return true;
      }
      if (!this._req || !this._res) {
        return false;
      }
      try {
        const token = await new AuthIdentifier(this._req).verify();
        if (!token.uid) {
          throw new Error();
        }
        this._token = token;
        return true;
      } catch (e) {
        this._res
          .status(200)
          .json(new ApiResponse(403, "User authentication faild.", []).json());
      }
      return false;
    }

    public check(
      filter: (context: ExecutableContext) => Promise<boolean> | boolean
    ) {
      this._filters.push(() => {
        const result = filter(this.context);
        if (typeof result === "boolean") {
          return Promise.resolve().then(() => result);
        } else {
          return result;
        }
      });
      return this;
    }

    public execute(
      exec: (context: ExecutableContext) => Promise<any>
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

        this._req = req;
        this._res = res;

        if (!(await this.doAuth())) {
          return;
        }

        const checkErrors = (
          await Promise.all(this._filters.map((f) => f()))
        ).filter((c) => !c);

        if (checkErrors.length > 0) {
          res.status(200).json(new ApiResponse(400, "Check Error").json());
          return;
        }

        try {
          res.status(200).json(await exec(this.context)); // TODO: POSTに対応
        } catch (e) {
          res
            .status(200)
            .json(new ApiResponse(400, "Internal Error", e).json());
        }
      };
    }
  }

  class AuthIdentifier {
    private _req: functions.https.Request;

    private get nakedIdToken() {
      if (!this._req.headers.authorization) {
        return "";
        // throw new Error('Authorization ヘッダが存在しません。')
      }
      const match = this._req.headers.authorization.match(/^Bearer (.*)$/);
      if (match) {
        const idToken = match[1];
        return idToken;
      }
      return "";
    }

    public async verify() {
      const idToken = this.nakedIdToken;
      if (!idToken) {
        throw new TokenNotFoundError();
      }
      return await admin.auth().verifyIdToken(idToken);
    }

    constructor(req: functions.https.Request) {
      this._req = req;
    }
  }

  class TokenNotFoundError extends Error {
    constructor() {
      super("Token Not Found.");
    }
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
