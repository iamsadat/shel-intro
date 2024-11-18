import Head from "next/head";
import Intro from "./components/Intro";
// import Intro from "../components/Intro";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Website Intro</title>
        <meta name="description" content="Welcome to our website" />
      </Head>
      <Intro />
    </div>
  );
}
