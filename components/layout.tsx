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
        height="90vh"
        style={{
          marginBottom: "50px",
          clipPath: "polygon(0 0, 100% 0, 100% 75vh, 0 100%)",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('/img/banner.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "#4f4f4e",
          width: "100%",
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
          <Navigate size="large" color="white" />
        </Box>
        <Box
          className="box-corners"
          pad="medium"
          style={{
            textAlign: "center",
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          <Heading margin={{ bottom: "xsmall", top: "0" }}>
            Route Finder
          </Heading>
          <Heading level={3} margin={{ top: "xsmall" }}>
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
            <Heading level={4} margin="none" color="white">
              Explore now
            </Heading>
          </Button>
        </Box>
      </Box>
      {children}
      <footer className={styles.footer}></footer>
    </div>
  );
};
