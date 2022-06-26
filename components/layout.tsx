import { Box, Button, Heading } from "grommet";
import { Navigate } from "grommet-icons";
import { Router, useRouter } from "next/dist/client/router";
import Head from "next/head";
import { FC, ReactNode } from "react";
import styles from "../styles/Home.module.css";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <Head>
        <title>Route Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        height="75vh"
        style={{
          marginBottom: "50px",
          clipPath: "polygon(0 0, 100% 0, 100% 65vh, 0 100%)",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('/img/banner2.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#4f4f4e",
          position: "relative",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            color: "white",
          }}
        >
          <Navigate size="large" color="brand" />
        </Box>
        <Box
          pad="xlarge"
          background="rgba(100, 150, 150, 0.1)"
          elevation="xlarge"
          height={"100%"}
          width="large"
          align="center"
          alignContent="center"
          alignSelf="end"
          style={{
            display: "inline-block",
            textAlign: "center",
          }}
        >
          <Box pad="medium">
            <Box
              align="center"
              alignContent="center"
              alignSelf="center"
              className="box-corners"
              margin={{ bottom: "xsmall", top: "0" }}
            >
              <Heading color="brand" margin="small" textAlign="center">
                Route Finder
              </Heading>
            </Box>
            <Heading level={3} margin={{ top: "xsmall" }} color="neutral-light">
              Search and explore hikes across the UK
            </Heading>
            <Button
              primary
              hoverIndicator
              margin={{ bottom: "medium" }}
              style={{
                padding: "6px",
              }}
              onClick={() => router.push("/#search")}
            >
              <Heading
                level={4}
                margin="none"
                color="white"
                style={{ display: "inline-block" }}
              >
                Explore now
              </Heading>
            </Button>
          </Box>
        </Box>
      </Box>
      {children}
      <footer className={styles.footer}></footer>
    </div>
  );
};
