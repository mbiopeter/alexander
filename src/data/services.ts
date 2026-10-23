export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  icon:
    "web" | "django" | "software" | "automation" | "debugging" | "maintenance";
  summary: string;
  description: string;
  tagline: string;
  deliverables: string[];
  stack: string[];
  idealFor: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web development",
    shortTitle: "Websites & web apps",
    icon: "web",
    summary:
      "Fast, thoughtful websites that look right and work beautifully on every screen.",
    description:
      "Bring your business, personal brand, or next idea online with a website built around what visitors need to do. From a focused landing page to an interactive web app, we can plan the right structure, develop the interface, and get it ready to share.",
    tagline: "Give your idea a place to live.",
    deliverables: [
      "Responsive page layouts for phone, tablet, and desktop",
      "Reusable interface components and clear navigation",
      "Forms, interactive features, and agreed integrations",
      "Page titles, sharing metadata, and accessibility fundamentals",
      "A deployment-ready project with setup and handover notes",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    idealFor: [
      "Business websites",
      "Creator portfolios",
      "Landing pages",
      "Interactive web apps",
    ],
  },
  {
    slug: "python-django",
    title: "Python & Django development",
    shortTitle: "Python & Django",
    icon: "django",
    summary:
      "The application logic, data models, and APIs that keep a useful product running.",
    description:
      "Build the backend your product needs with Python and Django. We can design data models, create APIs with Django REST Framework, and connect an interface to a structured application. Authentication, permissions, admin tools, and PostgreSQL integration are scoped around your actual requirements.",
    tagline: "A solid foundation behind the interface.",
    deliverables: [
      "Django project structure and application logic",
      "Django REST Framework endpoints with agreed validation and permissions",
      "PostgreSQL data models, relationships, and migrations",
      "Authentication and role-based access where required",
      "Django admin setup and agreed third-party integrations",
      "Relevant tests, API notes, and deployment guidance",
    ],
    stack: ["Python", "Django", "Django REST Framework", "PostgreSQL"],
    idealFor: [
      "Business applications",
      "API backends",
      "Admin portals",
      "Data-driven platforms",
    ],
  },
  {
    slug: "custom-software",
    title: "Custom software development",
    shortTitle: "Custom software",
    icon: "software",
    summary:
      "Practical tools shaped around your workflow, instead of making you work around the tool.",
    description:
      "If an existing tool does not fit the job, we can build something focused on the way you work. Start with the task, the people using it, and the outcome you need. Together we can shape a useful first version and a clear plan for what comes next.",
    tagline: "Make the everyday work a little easier.",
    deliverables: [
      "An agreed feature list and a practical first-version scope",
      "Purpose-built screens, workflows, and application logic",
      "Data handling and integrations matched to the project",
      "Clear validation and useful error states",
      "Relevant checks, source code, and a documented handover",
    ],
    stack: ["Python", "Django", "React", "TypeScript", "PostgreSQL"],
    idealFor: [
      "Internal tools",
      "Dashboards",
      "Workflow apps",
      "Product prototypes",
    ],
  },
  {
    slug: "python-automation",
    title: "Python automation",
    shortTitle: "Python automation",
    icon: "automation",
    summary:
      "Turn repeatable manual tasks into clear, dependable scripts that do the heavy lifting.",
    description:
      "Cut down the repetitive work involved in handling files, cleaning data, and preparing reports. We can map the task, define what a correct result looks like, and build a Python script with readable outputs and sensible checks.",
    tagline: "Spend less time doing the same thing twice.",
    deliverables: [
      "A clearly defined input, process, and expected output",
      "Scripts for agreed file, spreadsheet, or data tasks",
      "Data validation, useful logging, and actionable error messages",
      "API connections where access is available and authorized",
      "Run instructions and examples for repeating the workflow",
    ],
    stack: ["Python", "pandas", "CSV & Excel", "REST APIs"],
    idealFor: [
      "Data cleanup",
      "Report preparation",
      "File processing",
      "Repetitive workflows",
    ],
  },
  {
    slug: "debugging",
    title: "Debugging & code fixes",
    shortTitle: "Debugging & fixes",
    icon: "debugging",
    summary:
      "Find the cause of a stubborn problem, understand the fix, and get your project moving again.",
    description:
      "An error message is a starting point. I can help reproduce the problem, trace what is happening, and work toward a fix that addresses the cause. That can include broken interfaces, Python exceptions, Django errors, API issues, or a workflow that produces the wrong result.",
    tagline: "Let’s untangle what is going wrong.",
    deliverables: [
      "A focused review of the problem and steps to reproduce it",
      "An explanation of the identified cause",
      "A targeted code change within the agreed scope",
      "Checks against the original issue and relevant edge cases",
      "Notes on the change and any remaining limitations",
    ],
    stack: ["Python", "Django", "JavaScript", "React", "Next.js"],
    idealFor: [
      "Unexpected errors",
      "Broken features",
      "API failures",
      "Code review",
    ],
  },
  {
    slug: "maintenance",
    title: "Website & software maintenance",
    shortTitle: "Maintenance & updates",
    icon: "maintenance",
    summary:
      "Keep an existing project useful with considered updates, small improvements, and ongoing care.",
    description:
      "Projects need attention after their first release. I can help with content and interface changes, dependency updates, bug fixes, and improvements to an existing codebase. We will agree on the scope, access, and schedule before work begins.",
    tagline: "Keep a good thing working well.",
    deliverables: [
      "A review of the requested changes and current project setup",
      "Agreed content, interface, or feature updates",
      "Dependency updates with compatibility checks where included",
      "Checks around affected functionality before handover",
      "A clear change summary and next-step recommendations",
    ],
    stack: ["Next.js", "React", "Django", "Git", "Deployment workflows"],
    idealFor: [
      "Existing websites",
      "Small feature updates",
      "Dependency upkeep",
      "Ongoing improvements",
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
