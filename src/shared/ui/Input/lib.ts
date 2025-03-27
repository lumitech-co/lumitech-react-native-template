import { match } from 'ts-pattern';

const TEXT_INPUT_PADDIGS = {
  BASE_PADDING: 14,
  LEFT_PADDING: 45,
  RIGHT_PADDING: 45,
} as const;

interface LeftPaddingParams {
  isLeftIconShown: boolean;
}

interface RightPaddingParams {
  isRightIconShown: boolean;
}

interface TopPaddingParams {
  multiline?: boolean;
}

export interface InputConstructorParams {
  isRightIconShown: boolean;
  isLeftIconShown: boolean;
}

export const constructPaddingLeft = ({
  isLeftIconShown,
}: LeftPaddingParams) => {
  return match({ isLeftIconShown })
    .with({ isLeftIconShown: true }, () => TEXT_INPUT_PADDIGS.LEFT_PADDING)
    .otherwise(() => TEXT_INPUT_PADDIGS.BASE_PADDING);
};

export const constructPaddingRight = ({
  isRightIconShown,
}: RightPaddingParams) => {
  return match({ isRightIconShown })
    .with({ isRightIconShown: true }, () => TEXT_INPUT_PADDIGS.RIGHT_PADDING)
    .otherwise(() => TEXT_INPUT_PADDIGS.BASE_PADDING);
};

export const constructPaddingTop = ({ multiline }: TopPaddingParams) => {
  return match({ multiline })
    .with({ multiline: true }, () => '13.5px')
    .otherwise(() => '0px');
};
