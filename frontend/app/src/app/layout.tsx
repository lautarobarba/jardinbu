import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { LoadingPageWrapper } from "@/wrappers/LoadingPageWrapper";
import { NextUIProvider } from "@/providers/NextUIProvider";
import { SnackbarProvider } from "@/providers/SnackbarProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jardín Botánico de Ushuaia",
  description: "Sitio web insitucional del Jardín Botánico de Ushuaia",
  author: "Lautaro Barba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          <NextUIProvider>
            <SnackbarProvider>
              <LanguageProvider>
                <ReactQueryProvider>
                  <LoadingPageWrapper>{children}</LoadingPageWrapper>
                </ReactQueryProvider>
              </LanguageProvider>
            </SnackbarProvider>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
