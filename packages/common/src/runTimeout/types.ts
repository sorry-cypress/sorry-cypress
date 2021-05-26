export interface RunTimeout {
  runId: string;
  timeoutAfter: Date;
  timeoutSeconds: number;
  checkedOn: Date | null;
}
