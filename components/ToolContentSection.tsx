type Props = {
  title: string;
  description: string;
  category?: string;
};

type CategoryContent = {
  intro: string;
  useCases: string[];
  bestPractices: string[];
  limitations: string;
};

function getCategoryContent(category?: string): CategoryContent {
  switch (category) {
    case "Calculators":
      return {
        intro:
          "Calculator tools help turn inputs into clear estimates, comparisons and planning numbers. They are useful when you want to understand a result quickly without building a spreadsheet from scratch.",
        useCases: [
          "Estimate costs, payments, savings, percentages or financial outcomes.",
          "Compare different scenarios before making a decision.",
          "Check assumptions quickly while planning a purchase, project or budget.",
          "Use the result as a starting point for deeper research or professional advice.",
        ],
        bestPractices: [
          "Double-check important inputs such as rates, prices, terms and percentages.",
          "Test more than one scenario to understand how sensitive the result is.",
          "Use realistic assumptions when estimating future costs or returns.",
          "For legal, tax, mortgage or investment decisions, confirm the result with a qualified professional.",
        ],
        limitations:
          "Calculator results are estimates based on the values you enter. They do not replace professional financial, legal, tax, medical or technical advice.",
      };

    case "Image & PDF Tools":
      return {
        intro:
          "Image and PDF tools help you prepare, convert, resize, compress or organize files directly in a focused online workflow. They are useful when you need a quick file task without installing heavy software.",
        useCases: [
          "Convert files into a more useful format for sharing, uploading or archiving.",
          "Reduce file size before sending documents or images online.",
          "Prepare images and PDFs for websites, forms, presentations or email attachments.",
          "Organize document pages or create cleaner files for everyday work.",
        ],
        bestPractices: [
          "Keep an original copy of important files before editing or converting them.",
          "Check the downloaded result before deleting the source file.",
          "Use reasonable compression settings when quality matters.",
          "For sensitive documents, review the tool description and privacy notes before processing files.",
        ],
        limitations:
          "File results can vary depending on the original file, browser support, file size, image quality and selected settings.",
      };

    case "Developer Tools":
      return {
        intro:
          "Developer tools help format, validate, convert and inspect technical content such as code, structured data, URLs and configuration values. They are designed for fast checks during everyday development work.",
        useCases: [
          "Format or clean structured data before using it in a project.",
          "Convert technical values, encodings or data formats.",
          "Inspect code, strings, URLs or configuration snippets.",
          "Save time on small development tasks without opening a full IDE workflow.",
        ],
        bestPractices: [
          "Review generated or formatted output before using it in production.",
          "Avoid pasting secrets, private keys or sensitive credentials into online tools.",
          "Validate important data with your own test cases.",
          "Use the result as a helper, not as a replacement for proper testing.",
        ],
        limitations:
          "Developer tools can simplify common tasks, but they cannot guarantee that output is correct for every framework, runtime or production environment.",
      };

    case "SEO Tools":
      return {
        intro:
          "SEO tools help prepare metadata, content, URLs and search-related assets. They are useful for quick checks before publishing or improving a page.",
        useCases: [
          "Review titles, descriptions, URLs and content elements before publishing.",
          "Generate or inspect metadata for search and social sharing.",
          "Check content structure, keyword usage or technical SEO details.",
          "Improve consistency across website pages and marketing assets.",
        ],
        bestPractices: [
          "Write for real users first, not only for search engines.",
          "Keep titles and descriptions accurate to the page content.",
          "Avoid keyword stuffing or repetitive low-value text.",
          "Use SEO tools together with Search Console data and real user intent.",
        ],
        limitations:
          "SEO tools can help with preparation and checks, but they cannot guarantee rankings, indexing or traffic.",
      };

    case "Business Tools":
      return {
        intro:
          "Business tools help create practical calculations, documents, templates and planning outputs for freelancers, creators, founders and small teams.",
        useCases: [
          "Estimate revenue, costs, margins, rates or business performance.",
          "Prepare simple business documents or planning assets.",
          "Create quick outputs for client work, internal planning or personal organization.",
          "Save time on repetitive business tasks.",
        ],
        bestPractices: [
          "Review business outputs before sending them to clients or partners.",
          "Use realistic assumptions when calculating revenue, cost or profitability.",
          "Keep records of important financial or contractual decisions.",
          "For accounting, legal or tax matters, verify results with a professional.",
        ],
        limitations:
          "Business tools are designed for planning and productivity. They do not replace legal, accounting, tax or financial advice.",
      };

    case "Text Tools":
      return {
        intro:
          "Text tools help clean, count, transform, compare and prepare written content. They are useful for writing, editing, publishing and everyday office tasks.",
        useCases: [
          "Count words, characters, sentences or reading time.",
          "Clean lists, remove duplicates or reformat text.",
          "Convert text between different styles or formats.",
          "Prepare content for websites, documents, emails or social posts.",
        ],
        bestPractices: [
          "Review transformed text before publishing or sending it.",
          "Keep a copy of the original text when making large changes.",
          "Check formatting after copying results into another app.",
          "Use text tools to speed up editing, not to replace careful review.",
        ],
        limitations:
          "Text tools can help with formatting and cleanup, but they may not understand context, tone or meaning the way a human editor can.",
      };

    case "Generators":
      return {
        intro:
          "Generator tools help create ideas, names, codes, prompts and other starting points quickly. They are useful for brainstorming and speeding up creative work.",
        useCases: [
          "Generate ideas when starting a project, brand, profile or piece of content.",
          "Create names, codes, labels or creative variations.",
          "Explore multiple options before choosing a final result.",
          "Use generated output as inspiration for your own work.",
        ],
        bestPractices: [
          "Review generated ideas before using them publicly.",
          "Check trademarks, availability or originality when naming a business or product.",
          "Adjust generated results to match your own brand, audience or purpose.",
          "Avoid relying on generated output without human review.",
        ],
        limitations:
          "Generated results are suggestions and starting points. They may need editing, verification or originality checks before final use.",
      };

    default:
      return {
        intro:
          "Toollane tools are built to make common online tasks easier, faster and more accessible. Each tool focuses on a specific task and presents the result directly on the page.",
        useCases: [
          "Complete a focused online task without installing extra software.",
          "Save time on repetitive calculations, conversions or formatting work.",
          "Use a simple mobile-friendly interface on different devices.",
          "Get a practical result that can be copied, downloaded or applied.",
        ],
        bestPractices: [
          "Review important results before using them in professional work.",
          "Check your inputs carefully if the result depends on numbers or settings.",
          "Keep copies of important files, text or data before editing.",
          "Use Toollane as a helpful online resource, not as a replacement for expert advice.",
        ],
        limitations:
          "Toollane tools are designed for convenience and productivity. Results may depend on your inputs, browser, files or selected settings.",
      };
  }
}

export default function ToolContentSection({
  title,
  description,
  category,
}: Props) {
  const content = getCategoryContent(category);
  const toolName = title.toLowerCase();

  return (
    <section className="mt-14 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-black">
        About the {title}
      </h2>

      <div className="mt-6 space-y-6 leading-8 text-black/65">
        <p>{description}</p>

        <p>
          The {toolName} is designed to help users complete a specific task with
          a clear, focused workflow. Instead of switching between apps,
          spreadsheets or manual steps, you can enter the relevant information,
          review the result and continue with your work.
        </p>

        <p>{content.intro}</p>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-black text-black">
              Common use cases
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-black/65">
              {content.useCases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-black text-black">
              Tips for best results
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-black/65">
              {content.bestPractices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-[#fff8df] p-5">
          <h3 className="text-lg font-black text-black">
            Accuracy and limitations
          </h3>

          <p className="mt-3 text-sm leading-7 text-black/65">
            {content.limitations}
          </p>
        </div>

        <h3 className="pt-4 text-xl font-bold text-black">
          How to use the {title}
        </h3>

        <ol className="grid gap-4 text-sm leading-7 text-black/65 sm:text-base lg:grid-cols-3">
          <li className="rounded-2xl border border-black/10 bg-white p-5">
            <strong className="block text-black">1. Add your input</strong>
            Enter the values, text, files or settings required by the tool.
          </li>

          <li className="rounded-2xl border border-black/10 bg-white p-5">
            <strong className="block text-black">2. Review the result</strong>
            Check the output directly on the page and adjust your input if
            needed.
          </li>

          <li className="rounded-2xl border border-black/10 bg-white p-5">
            <strong className="block text-black">3. Use the output</strong>
            Copy, download, compare or apply the result to your task.
          </li>
        </ol>

        <h3 className="pt-4 text-xl font-bold text-black">
          Why use Toollane?
        </h3>

        <p>
          Toollane focuses on practical browser-based tools with a clean
          interface, fast results and useful supporting information. The goal is
          to make everyday online tasks easier without unnecessary distractions
          or complicated setup steps.
        </p>
      </div>
    </section>
  );
}