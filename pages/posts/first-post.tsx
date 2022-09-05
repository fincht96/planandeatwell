import { ReactElement } from "react";
import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";

export default function FirstPost(): ReactElement {
  return (
    <>
      <Layout>
        <Head>
          <title>First Post</title>
          <link rel="icon" href="/favicon-1.ico" />
        </Head>
        <h1>First Post</h1>
        <h2>
          <Link href="/">Back to home</Link>
        </h2>
      </Layout>
    </>
  );
}
