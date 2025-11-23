import { Inter } from "next/font/google";
import { RootProvider as FumadocsProvider } from "fumadocs-ui/provider/next";
import "@frontend/ui/globals.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <FumadocsProvider>{children}</FumadocsProvider>
      </body>
    </html>
  );
}
