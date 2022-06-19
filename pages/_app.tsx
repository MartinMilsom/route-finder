/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Grommet, ThemeType } from "grommet";
import { FC } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";

const theme: ThemeType = {
  global: {
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
    primary: { color: "rgba(79, 79, 78, 0.4)" },
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
