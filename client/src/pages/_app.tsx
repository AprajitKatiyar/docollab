import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import AppBar from "@/components/AppBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className="flex flex-col h-screen">
        <AppBar />
        <div className="flex-1 overflow-y-auto ">
          <Component {...pageProps} />
        </div>
      </div>
    </SessionProvider>
  );
}
