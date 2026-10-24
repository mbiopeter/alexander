import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { PageIntro } from "@/components/page-ui";
import { DestinationLink } from "@/components/destination-link";
import { makeMetadata } from "@/lib/metadata";

export const metadata = makeMetadata(
  "Privacy",
  "How this site handles your enquiries, browser preferences, demonstration data, and links to external services.",
  "/privacy/",
);

export default function PrivacyPage() {
  return (
    <main id="main" className="page-main">
      <PageIntro
        eyebrow="PRIVACY / A CLEAR PICTURE"
        title="Your data, explained simply."
        description="Here’s what happens when you browse, try a demo, send an enquiry, or support my work."
      />
      <section className="page-section shell">
        <div className="privacy-page-grid">
          <article className="prose-content">
            <h2>Browsing this website</h2>
            <p>
              This website does not have visitor accounts, an enquiry database,
              advertising trackers, or analytics added by the site itself. The
              hosting provider may process standard request information, such as
              IP addresses and access logs, to serve and protect the site.
            </p>
            <h2>Your theme preference</h2>
            <p>
              The light or dark theme follows your device by default. If you
              choose a theme, that choice is saved in your browser’s local
              storage under <code>alexender-theme</code>. You can switch back to
              System in the theme menu or clear your browser’s site data.
            </p>
            <h2>Project demos</h2>
            <p>
              Focusboard saves the tasks you enter in this browser’s local
              storage so they remain on this device between visits. Delete tasks
              from the board, replace them with the sample tasks, or clear your
              browser’s site data to remove your entries. The Data Tidy tool
              processes text and CSV files in your browser; this site does not
              upload their contents. The Django API Lab uses example data and
              simulated responses inside your browser. The mini lessons on the
              Learn page use temporary values that reset when you leave or
              refresh.
            </p>
            <h2>The coding playground</h2>
            <p>
              The coding playground appears at /playground/ and on missing
              pages. Your code drafts, selected exercise, viewed solutions, and
              collected correct answers are saved in this browser under
              <code>detour-playground:progress:v1</code>. They are not synced to
              an account. You can delete collected answers individually, export
              them, or clear this website’s browser data to remove all saved
              practice.
            </p>
            <p>
              A practice backup includes your unfinished drafts and saved answers.
              Export creates a file on your device. Restore reads a file locally
              and lets you merge it with your current practice or deliberately
              replace it. The backup is not uploaded to this website. Anyone
              you share the file with can read the code it contains.
            </p>
            <p>
              When you choose Run, your program and the exercise identifier are
              sent to this website’s server. The server sends your program and
              exercise test inputs to the configured code execution service,
              which compiles or runs them and returns results. Service and
              hosting logs may process request information under their own
              policies. Avoid putting secrets or private project data in
              practice code. Viewing a question or editing a draft does not run
              or upload your code.
            </p>
            <h2>Your project brief</h2>
            <p>
              The Hire page keeps an unfinished brief in this tab’s session
              storage so you can return to it after navigating or refreshing.
              Use Clear draft on the form to remove it, or close the tab
              to end the browser session. If browser storage is unavailable,
              you can still prepare and copy a brief without saving it.
            </p>
            <h2>Choosing a contact method</h2>
            <p>
              The Hire Me form prepares a WhatsApp draft from the details you
              enter. When you continue, this website’s contact endpoint receives
              the draft in a link and redirects you to WhatsApp. The application
              does not save an enquiry database, but URLs can appear in hosting
              logs and browser history. The destination uses a configured active
              WhatsApp username when available, with a phone link as a fallback.
              Review the message in WhatsApp before sending it. WhatsApp handles
              the conversation under its own terms and privacy policy.
            </p>
            <p>
              When email contact is available, Email this brief opens a draft in
              your email application using the same details. The website does
              not send that email. Review and send it yourself; your email
              provider handles the resulting message. Copy brief places the
              prepared text on your clipboard only when you choose that action.
            </p>
            <p>
              For an initial enquiry, please leave out passwords, private keys,
              and sensitive personal or client information. We can discuss an
              appropriate way to share project access when it is needed.
            </p>
            <h2>Supporting my work</h2>
            <p>
              The support buttons open my hosted Paystack payment page. Your
              payment information is entered on Paystack, and this website does
              not collect or store card details or verify payment status.
              Paystack processes the payment and provides its own confirmation.
              Contact me on WhatsApp if you need to discuss a contribution.
            </p>
            <h2>Links to other services</h2>
            <p>
              TikTok, GitHub, LinkedIn, WhatsApp, email providers, and Paystack are separate services.
              Their own privacy policies apply after you open them. This site
              loads its fonts and illustrations from its own files.
            </p>
            <h2>Questions</h2>
            <p>
              If you have a question about this website or information you’ve
              shared with me, please start a conversation on WhatsApp.
            </p>
            <DestinationLink
              destination="whatsapp"
              message="Hi Alexender! I have a question about privacy on your website."
              className="button button-primary"
            >
              <MessageCircle size={18} /> Ask about privacy{" "}
              <ArrowUpRight size={17} />
            </DestinationLink>
          </article>
          <aside className="info-card privacy-sidebar">
            <p className="eyebrow">THE QUICK VERSION</p>
            <h2>You stay in control.</h2>
            <ul className="feature-list">
              <li>Choose your theme.</li>
              <li>Keep demo data on your device.</li>
              <li>Run code only when you choose.</li>
              <li>Restore or clear your unfinished brief.</li>
              <li>Review a contact draft before sending.</li>
              <li>Pay through Paystack’s hosted page.</li>
            </ul>
            <Link href="/" className="text-link mt-7">
              Back to home <ArrowUpRight size={16} />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
