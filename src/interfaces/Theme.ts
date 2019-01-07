export interface ThemeProp {
  theme?: Theme;
}

export default interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    info: string;
    warning: string;
    danger: string;
    light: string;
    dark: string;
  }
}
