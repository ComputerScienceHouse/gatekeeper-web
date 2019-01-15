import Sockette, { SocketteOptions } from "sockette";
import { IssueRequest, TaskResponse } from "../interfaces/helper";

export default class AdminHelperAPI {
  public static checkHealth(service?: string): Promise<boolean> {
    return fetch(`${AdminHelperAPI.BASE_URL}/healthz${service != null ? `/${service}` : ""}`)
      .then((resp: Response) => {
        if (!resp.ok) {
          throw new Error(`HTTP error (status ${resp.status})`);
        }
        return resp.text();
      })
      .then((text: string) => text === "ok")
      .catch(() => false);
  }

  public static checkNFCHealth(): Promise<boolean> {
    return AdminHelperAPI.checkHealth("nfc");
  }

  public static issue(req: IssueRequest): Promise<string> {
    return AdminHelperAPI.startTaskRPC("issue", req);
  }

  public static verify(req: IssueRequest): Promise<string> {
    return AdminHelperAPI.startTaskRPC("verify", req);
  }

  public static openTaskLog(taskId: string, opts: SocketteOptions) {
    return new Sockette(`${AdminHelperAPI.BASE_WS_URL}/tasks/${taskId}/log`, opts);
  }

  private static HELPER_ADDRESS = "127.0.0.1:42069";
  private static BASE_URL = `http://${AdminHelperAPI.HELPER_ADDRESS}`;
  private static BASE_WS_URL = `ws://${AdminHelperAPI.HELPER_ADDRESS}`;

  private static startTaskRPC(rpc: string, body: object) {
    return fetch(`${AdminHelperAPI.BASE_URL}/${rpc}`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then((resp: Response) => {
        if (!resp.ok) {
          throw new Error(`HTTP error (status ${resp.status})`);
        }
        return resp.json();
      })
      .then((resp: TaskResponse) => resp.id);
  }
}