import { Inter } from "next/font/google";
import "../globals.css";
import ToasterContext from "../../components/ToasterContext";
const inter = Inter({ subsets: ["latin"] });
import Provider from "../../components/Provider"
export const metadata = {
  title: "Auth Halo Chat",
  description: "Build a Next 14 Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-purple-1`}>
        <Provider>
        <ToasterContext/>
        {children}
        </Provider>
      
        </body>
    </html>
  );
}