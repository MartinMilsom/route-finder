/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Grommet} from "grommet";
import "../styles/globals.css";

const theme = {
    global: {
        font: {
            family: "Roboto",
            size: "14px",
            height: "20px",
        },
    },
};

function MyApp({ Component, pageProps }) {
    return <Grommet full theme={theme}>
        <Component {...pageProps} />
    </Grommet>;
}

export default MyApp;
