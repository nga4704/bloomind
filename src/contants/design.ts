// Color types
export type ColorPalette = {
  primary: string;
  secondary: string;
  thirdary: string;
  accent: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  background: {
    primary: string;
    secondary: string;
    paper: string;
  };
};

// Typography types
export type FontWeight = "light" | "regular" | "medium" | "bold";
export type TextVariant = "h1" | "h2" | "h3" | "body1" | "body2" | "caption";

export interface TypographyConfig {
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight: number;
  color: string;
}

// Spacing types
export type SpacingUnit = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Component props types
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant: "primary" | "secondary" | "outlined" | "text";
  size: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export interface CardProps extends BaseComponentProps {
  elevation?: 0 | 1 | 2 | 3;
  padding?: SpacingUnit;
}
