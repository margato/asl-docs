import MDXComponents from '@theme-original/MDXComponents';
import ZoomImage from '@site/src/components/ZoomImage';
import {UseCase} from '@site/src/components/UseCases';
import Playground from '@site/src/components/Playground';

export default {
  ...MDXComponents,
  img: ZoomImage,
  Playground,
  UseCase,
};
