import Link from "next/link";
import { Navbar, Footer, EmptyState } from "@/components/common/ui";
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container section">
        <EmptyState
          title="This page couldn’t be found."
          description="Let’s find your way back to a place of remembrance."
        />
        <div style={{ textAlign: "center" }}>
          <Link className="btn" href="/campaigns/">
            Explore memorials
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
