import Link from "next/link";
import { Navbar, Footer } from "@/components/common/ui";
import { ArrowUpRight } from "lucide-react";
export default function About() {
  return (
    <>
      <Navbar />
      <main>
        <div className="container page-hero center">
          <div className="eyebrow">OUR STORY</div>
          <h1>A tradition worth carrying forward.</h1>
          <p>
            Remembering together. Supporting one another. Keeping the heart of
            Nsaabɔdeɛ alive.
          </p>
        </div>
        <article className="about-article">
          <h2>“We are with you.”</h2>
          <p>
            In Ghana, showing up for a bereaved family takes many forms. A
            visit. A meal. A contribution. Each says the same thing: you do not
            have to carry this alone.
          </p>
          <h2>Community, wherever we are.</h2>
          <p>
            Nsaabɔdeɛ brings that spirit into a shared digital space. A family
            can tell a loved one’s story, share funeral details, and keep
            contributions organised. Friends near and far can remember, leave a
            message, and offer support in a way that respects their wishes.
          </p>
          <h2>Care in the details.</h2>
          <p>
            Our design makes room for the traditions that matter: cash and
            digital contributions side by side, family administrators working
            together, and MC acknowledgements that honour each contributor’s
            preference.
          </p>
          <h2>About this demonstration</h2>
          <p>
            This is a frontend prototype. All memorials, portraits, users, and
            financial records are illustrative. Data is saved only in your
            browser. Authentication, payments, withdrawals, and moderation are
            simulations. No money is transferred and no backend service is
            connected.
          </p>
          <Link className="btn" href="/campaigns/">
            Explore the memorials <ArrowUpRight size={16} />
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
