const TEXT_INPUT_PADDINGS = {
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

export interface InputConstructorParams {
  isRightIconShown: boolean;
  isLeftIconShown: boolean;
}

export const constructPaddingLeft = ({
  isLeftIconShown,
}: LeftPaddingParams) => {
  if (isLeftIconShown) {
    return TEXT_INPUT_PADDINGS.LEFT_PADDING;
  }

  return TEXT_INPUT_PADDINGS.BASE_PADDING;
};

export const constructPaddingRight = ({
  isRightIconShown,
}: RightPaddingParams) => {
  if (isRightIconShown) {
    return TEXT_INPUT_PADDINGS.RIGHT_PADDING;
  }

  return TEXT_INPUT_PADDINGS.BASE_PADDING;
};
