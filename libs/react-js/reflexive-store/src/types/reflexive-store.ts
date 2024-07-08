import type {
  IReflexiveStore as IReflexiveStoreBase,
  ReflexiveInitStoreConfig,
  ReflexiveDetachedValue,
  ReflexiveStoreMap,
} from '@norabytes/reflexive-store';
import type * as NoraTypes from '@norabytes/nora-types';
import type { RequiredDeep } from 'type-fest';
import type { StoreMap } from './store-map';

export interface IReflexiveStore<StoreModel extends Record<string, any>>
  extends IReflexiveStoreBase<StoreModel, StoreMap<StoreModel> & ReflexiveStoreMap<StoreModel>> {
  /**
   * {@link React} `hook` which can be used to _initialize_ the internal `store` within a `ReactJS` _functional_ component.
   *
   * @param props `1:1` map of your {@link StoreModel} interface.
   * @param config See {@link InitStoreConfig}.
   * @remarks The `store` will be initialized **before** the component mount life-cycle.
   */
  useInitStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig<this>): this;

  /**
   * {@link React} `hook` similar to the {@link useInitStore} `hook`,
   * however the main difference is that whenever one of the provided {@link props}
   * changes, the `StoreContext.setValue` will be invoked as well.
   *
   * This behaves exactly as the `deps` array, ensuring that specific properties from the store
   * are always kept in sync with the specified {@link props}.
   */
  useBindToProps(props: Partial<StoreModel>): this;

  /**
   * Can be used to access all the {@link store} properties via `dot-notation` string and automatically `re-render` the component whenever one of them changes.
   * @param ctx The {@link store} properties.
   *
   * eg:
   *
   * ```ts
   * const [firstName, lastName, dobDay, dobMonth, dobYear] = storeService.useReduceStore('user.firstName', 'user.lastName', 'user.dob.day', 'user.dob.month', 'user.dob.year');
   *
   * console.log(firstName, lastName, dobDay, dobMonth, dobYear);
   * ```
   */
  useReduceStore<T extends NoraTypes.Mappers.LeavesDotNotation<StoreModel>[]>(
    ...ctx: T
  ): StoreReduceResult<StoreModel, T>;

  /**
   * {@link React} `hook` which will be invoked when the _internal_ `disposeEvent$` observable emits.
   *
   * @param callback The `callback` method to be invoked.
   */
  useDispose(callback: () => void | Promise<void>): void;
}

export interface InitStoreConfig<ThisInstance> extends ReflexiveInitStoreConfig {
  /** Optionally you can provide a `callback` which will be `invoked` once the component did mount. */
  onMountCallback?: (instance: ThisInstance) => void | Promise<void>;
}

export type StoreReduceResult<StoreModel, P extends string[]> = {
  [K in keyof P]: P[K] extends string
    ? NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]> extends ReflexiveDetachedValue<infer U>
      ? U
      : NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]>
    : never;
};