// @flow
import type {FieldId} from './DefaultProps';
import type {List} from 'immutable';

export type ArrayDefaultProps<T> = {|
  refId: FieldId,
  value: List<T>,
  onChange:
    (refId: FieldId | {[string]: FieldId}, type: string, value?: any) => Promise<void>
    | (Array<{
      refId: FieldId | {[string]: FieldId},
      type: string,
      value?: any
    }>) => Promise<void>
|};
