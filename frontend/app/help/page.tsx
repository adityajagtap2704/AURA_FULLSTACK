import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
export default function HelpPage() {
 const helpTopics = [
  {
    title: "Getting Started",
    description:
      "Connect your Gmail, Google Calendar, and Notion accounts from the Integrations section. Once connected, AURA automatically brings your emails, events, tasks, and documents into one unified workspace for easier management.",
  },
  {
    title: "Tasks",
    description:
      "Create, organize, prioritize, and track your daily tasks efficiently. Update task progress, manage deadlines, and mark completed items to stay organized and productive.",
  },
  {
    title: "Calendar",
    description:
      "Plan your schedule by creating events and synchronizing them with Google Calendar. Use the Day, Week, Month, and Agenda views to manage your meetings and upcoming activities.",
  },
  {
    title: "Messages",
    description:
      "Access your Gmail inbox directly within AURA. Read emails, search conversations, and stay connected without switching between multiple applications.",
  },
  {
    title: "Documents",
    description:
      "View and organize your connected Notion documents from a single location. Quickly access important notes, project documentation, and workspace information whenever needed.",
  },
  {
    title: "Need More Help?",
    description:
      "If you need further assistance, use the Keyboard Shortcuts, Report a Bug, Contact Support, or About AURA options available from the Help menu to find additional guidance.",
  },
];

  const quickStart = [
    "Connect your Gmail, Google Calendar, and Notion accounts from the Integrations section.",
    "Create and organize your daily tasks to manage your work efficiently.",
    "Use the Calendar to schedule meetings and synchronize upcoming events.",
    "View and manage Gmail messages directly from the Messages section.",
    "Access your Notion documents without leaving the AURA workspace.",
    "Use the AI Assistant to summarize information, answer questions, and improve productivity.",
    "Visit Keyboard Shortcuts, Report a Bug, or Contact Support whenever additional assistance is required.",
  ];

  return (
    <main className="min-h-screen bg-background py-10 px-6">
      <div className="mx-auto max-w-7xl">
     <div className="mb-8 flex items-center">

  <Link
    href="/dashboard"
    className="inline-flex items-center gap-2 rounded-full bg-[#C67A20] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#B56F1A] hover:shadow-md"
  >
    <ArrowLeft className="h-4 w-4" />
    Home
  </Link>

</div>

        {/* Page Header */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#C67A20]">
            Help Center
          </h1>

          <p className="mt-3 max-w-3xl text-muted-foreground leading-7">
            Welcome to the AURA Help Center. This guide will help you understand
            the platform, connect your productivity tools, and make the most of
            every feature available within your workspace.
          </p>
        </div>

        {/* Quick Start */}

        <section className="rounded-2xl border border-[#EADBC8] bg-[#FFF9F2] p-8 shadow-sm">

          <h2 className="text-2xl font-semibold text-[#C67A20]">
            Quick Start Guide
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Follow these steps to begin using AURA effectively.
          </p>

          <ol className="mt-6 space-y-5 list-decimal list-inside text-[15px] leading-7 text-foreground">

            {quickStart.map((step, index) => (
              <li key={index}>{step}</li>
            ))}

          </ol>

        </section>

        {/* Help Topics */}

        <section className="mt-10">

          <h2 className="text-2xl font-semibold text-[#C67A20] mb-6">
            Help Topics
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {helpTopics.map((topic) => (

              <div
                key={topic.title}
                className="rounded-2xl border border-[#EADBC8] bg-[#FFF9F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
              >

                <h3 className="text-xl font-semibold text-foreground">
                  {topic.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {topic.description}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* Footer */}

        <section className="mt-12 rounded-2xl border border-[#EADBC8] bg-[#FFF9F2] p-8">

          <h2 className="text-2xl font-semibold text-[#C67A20]">
            Support
          </h2>

          <p className="mt-3 text-muted-foreground leading-7">
            If you experience issues while using AURA, you can use the Help
            menu to access Keyboard Shortcuts, Report a Bug, Contact Support,
            or learn more About AURA.
          </p>

        </section>

      </div>
    </main>
  );
}