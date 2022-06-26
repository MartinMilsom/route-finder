/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Grommet, ThemeType } from "grommet";
import { FC } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";

const theme: ThemeType = {
  global: {
    colors: {
      brand: "#AE7832",
      focus: "#DDB989",
      "accent-1": "#3B4545",
      "accent-2": "#717A84",
      "neutral-dark": "#00050B",
      "neutral-light": "#E7D8B9",
    },
    font: {
      family: "Roboto",
      size: "14px",
      height: "20px",
    },
    hover: {
      background: {
        color: "brand",
      },
      color: {
        dark: "white",
        light: "white",
      },
    },
  },
  button: {
    primary: { color: "brand" },
  },
};
const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Grommet full theme={theme}>
      <Component {...pageProps} />
    </Grommet>
  );
};

export default MyApp;
