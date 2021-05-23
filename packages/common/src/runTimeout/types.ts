export interface RunTimeout {
  runId: string;
  orgId: string;
  timeoutAfter: Date;
  timeoutSeconds: number;
  checkedOn: Date | null;
}
