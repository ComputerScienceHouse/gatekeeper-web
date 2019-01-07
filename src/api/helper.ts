import Sockette, { SocketteOptions } from "sockette";
import { IssueRequest } from "../interfaces/helper";
import IssueResponse from "../interfaces/helper/IssueResponse";

export default class AdminHelperAPI {
  public static checkHealth(): Promise<boolean> {
    return fetch(`${AdminHelperAPI.BASE_URL}/healthz`)
      .then((resp: Response) => {
        if (!resp.ok) {
          throw new Error(`HTTP error (status ${resp.status})`);
        }
        return resp.text();
      })
      .then((text: string) => text === "ok")
      .catch(() => false);
  }

  public static issue(req: IssueRequest): Promise<string> {
    return fetch(`${AdminHelperAPI.BASE_URL}/issue`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(req)
    })
      .then((resp: Response) => {
        if (!resp.ok) {
          throw new Error(`HTTP error (status ${resp.status})`);
        }
        return resp.json();
      })
      .then((resp: IssueResponse) => resp.id);
  }

  public static openTaskLog(taskId: string, opts: SocketteOptions) {
    return new Sockette(`${AdminHelperAPI.BASE_WS_URL}/tasks/${taskId}/log`, opts);
  }

  private static HELPER_ADDRESS = "127.0.0.1:42069";
  private static BASE_URL = `http://${AdminHelperAPI.HELPER_ADDRESS}`;
  private static BASE_WS_URL = `ws://${AdminHelperAPI.HELPER_ADDRESS}`;
}