export type ExtractArrayItemType<T> = T extends (infer U)[] ? U : T;
