import type { Metadata } from "next";
import "./globals.css";
import "./frontend-polish.css";
import { Providers } from "@/components/providers";
export const metadata: Metadata = {
  title: "Nsaabɔdeɛ — Honouring lives. Supporting families.",
  description:
    "A thoughtful way to honour a life and support the people they leave behind. A Ghanaian funeral contribution platform — frontend demonstration.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#page-content" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <div id="page-content">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
