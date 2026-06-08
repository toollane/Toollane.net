type Props = {
  title: string;
  description: string;
  category?: string;
};

function getUseCaseText(category?: string) {
  switch (category) {
    case "Calculators":
      return "This tool is useful for quick calculations, planning, estimates, comparisons and everyday decision-making.";

    case "Image & PDF Tools":
      return "This tool is useful for preparing files, converting formats, reducing file size, organizing documents and improving digital workflows.";

    case "Developer Tools":
      return "This tool is useful for developers, students, technical teams and anyone working with code, structured data or web projects.";

    case "SEO Tools":
      return "This tool is useful for website owners, marketers, bloggers, SEO specialists and content creators who want to improve search visibility.";

    case "Business Tools":
      return "This tool is useful for freelancers, founders, small businesses, creators and teams that need practical business resources quickly.";

    case "Text Tools":
      return "This tool is useful for writers, students, editors, marketers, office workers and anyone working with text.";

    case "Generators":
      return "This tool is useful for brainstorming, content creation, design, naming, planning and generating ideas quickly.";

    default:
      return "This tool is useful for students, professionals, freelancers, creators, business owners and anyone who needs a quick and reliable online solution.";
  }
}

export default function ToolContentSection({
  title,
  description,
  category,
}: Props) {
  const toolName = title.toLowerCase();

  return (
    <section className="mt-14 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-black">
        About the {title}
      </h2>

      <div className="mt-6 space-y-6 leading-8 text-black/65">
        <p>{description}</p>

        <p>
          The {toolName} is designed to help users complete common online tasks
          quickly without installing software or creating an account. It works
          directly in the browser and is built for a clean, simple and
          mobile-friendly experience.
        </p>

        <h3 className="pt-4 text-xl font-bold text-black">
          How to use the {title}
        </h3>

        <ol className="list-decimal space-y-2 pl-6">
          <li>Open the tool on your device.</li>
          <li>Enter your values, text, files or settings.</li>
          <li>Review the result directly on the page.</li>
          <li>Copy, download or use the result for your task.</li>
        </ol>

        <h3 className="pt-4 text-xl font-bold text-black">
          Benefits
        </h3>

        <ul className="list-disc space-y-2 pl-6">
          <li>Free to use</li>
          <li>No signup required</li>
          <li>Works on desktop, tablet and mobile devices</li>
          <li>Fast results directly on the page</li>
          <li>Simple and user-friendly interface</li>
        </ul>

        <h3 className="pt-4 text-xl font-bold text-black">
          Who is this tool for?
        </h3>

        <p>{getUseCaseText(category)}</p>

        <h3 className="pt-4 text-xl font-bold text-black">
          Why use Toollane?
        </h3>

        <p>
          Toollane focuses on speed, usability and a clean user experience. Many
          online tools are overloaded with unnecessary features, slow interfaces
          or distracting layouts. Toollane aims to provide efficient tools that
          help users complete common tasks quickly.
        </p>
      </div>
    </section>
  );
}