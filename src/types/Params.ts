import { BodyParams } from './BodyParams';
import { PathParams } from './PathParams';
import { QueryParams } from './QueryParams';

export type Params = {
  body: BodyParams;
  path: PathParams;
  query: QueryParams;
};
