export type ArrayItemType<T> = T extends (infer U)[] ? U : T;
