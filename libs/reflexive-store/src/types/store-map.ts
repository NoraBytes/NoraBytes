import type { Primitive, RequiredDeep } from 'type-fest';
import type { StoreContext } from './store-context';
import type { DetachedValue } from '../utils';

export type StoreMap<T> = RequiredDeep<_StoreMap<T>>;

// prettier-ignore
type _StoreMap<StoreModel> = {
  [K in keyof StoreModel]:

  // Types which must be wrapped with the `DetachedValue` type.
  StoreModel[K] extends
    ((...args: any[]) => any) |
    undefined |
    void 
    ? DetachedValueWrapperRequired :

  // Valid Types.
  StoreModel[K] extends DetachedValue<infer U> ? StoreContext<U> : 
  StoreModel[K] extends Primitive | Array<any> ? StoreContext<StoreModel[K]> :

  // Recursively keep mapping the `StoreModel`.
  _StoreMap<StoreModel[K]>;
}

type DetachedValueWrapperRequired = 'USE_THE_DETACHED_VALUE_WRAPPER';