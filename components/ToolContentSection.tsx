type Props = {
  title: string;
  description: string;
  category?: string;
};

type CategoryContent = {
  intro: string;
  usefulFor: string[];
  reviewChecks: string[];
  limitation: string;
};

function getCategoryContent(category?: string): CategoryContent {
  switch (category) {
    case "Calculators":
      return {
        intro:
          "Calculator tools are useful when you want a quick estimate, comparison or planning number without creating a spreadsheet from scratch.",
        usefulFor: [
          "Estimating costs, payments, savings, percentages or time-based outcomes.",
          "Comparing different scenarios before making a decision.",
          "Testing assumptions while planning a purchase, project or budget.",
        ],
        reviewChecks: [
          "Double-check important inputs such as rates, prices, dates and percentages.",
          "Try more than one scenario to understand how sensitive the result is.",
          "Treat results as estimates, not as financial, tax, legal or professional advice.",
        ],
        limitation:
          "Calculator outputs depend on the values entered. For important decisions, verify results with a qualified professional or trusted source.",
      };

    case "Image & PDF Tools":
      return {
        intro:
          "Image and PDF tools help you prepare, convert, resize, compress or organize files in a focused browser-based workflow.",
        usefulFor: [
          "Reducing file size before uploading, sending or archiving files.",
          "Converting or preparing files for websites, forms, email or documents.",
          "Completing simple file tasks without installing heavy software.",
        ],
        reviewChecks: [
          "Keep an original copy before editing or converting important files.",
          "Check the downloaded result before deleting the source file.",
          "Use reasonable compression settings when quality matters.",
        ],
        limitation:
          "File results can vary depending on the original file, browser support, file size, image quality and selected settings.",
      };

    case "Developer Tools":
      return {
        intro:
          "Developer tools help format, validate, convert and inspect technical content such as code, structured data, URLs and configuration values.",
        usefulFor: [
          "Formatting or cleaning structured data before using it in a project.",
          "Converting technical values, encodings or data formats.",
          "Inspecting code, strings, URLs or configuration snippets during everyday development work.",
        ],
        reviewChecks: [
          "Review generated or formatted output before using it in production.",
          "Do not paste secrets, private keys or sensitive credentials into online tools.",
          "Validate important output with your own test cases.",
        ],
        limitation:
          "Developer tools simplify common tasks, but they cannot guarantee correctness for every framework, runtime or production environment.",
      };

    case "SEO Tools":
      return {
        intro:
          "SEO tools help prepare metadata, content, URLs and search-related assets before publishing or improving a page.",
        usefulFor: [
          "Reviewing titles, descriptions, URLs and content elements.",
          "Preparing metadata for search engines and social sharing.",
          "Checking consistency across website pages and marketing assets.",
        ],
        reviewChecks: [
          "Write for real users first, not only for search engines.",
          "Keep titles and descriptions accurate to the page content.",
          "Avoid keyword stuffing, duplicated copy or low-value filler text.",
        ],
        limitation:
          "SEO tools can help with preparation and checks, but they cannot guarantee rankings, indexing or traffic.",
      };

    case "Business Tools":
      return {
        intro:
          "Business tools help create practical calculations, documents, templates and planning outputs for freelancers, creators, founders and small teams.",
        usefulFor: [
          "Estimating revenue, costs, margins, rates or business performance.",
          "Preparing simple business documents or planning assets.",
          "Saving time on repetitive business and client-work tasks.",
        ],
        reviewChecks: [
          "Review business outputs before sending them to clients or partners.",
          "Use realistic assumptions when calculating revenue, cost or profitability.",
          "Verify accounting, legal or tax matters with a qualified professional.",
        ],
        limitation:
          "Business tools are designed for planning and productivity. They do not replace legal, accounting, tax or financial advice.",
      };

    case "Text Tools":
      return {
        intro:
          "Text tools help clean, count, transform, compare and prepare written content for writing, editing, publishing and everyday office work.",
        usefulFor: [
          "Counting words, characters, sentences or estimated reading time.",
          "Cleaning lists, removing duplicates or reformatting text.",
          "Preparing content for websites, documents, emails or social posts.",
        ],
        reviewChecks: [
          "Review transformed text before publishing or sending it.",
          "Keep a copy of the original text when making large changes.",
          "Check formatting after copying results into another app.",
        ],
        limitation:
          "Text tools help with formatting and cleanup, but they may not understand context, tone or meaning the way a human editor can.",
      };

    case "Generators":
      return {
        intro:
          "Generator tools help create ideas, names, prompts, codes or starting points quickly when you want inspiration or a first draft.",
        usefulFor: [
          "Generating ideas when starting a project, brand, profile or piece of content.",
          "Creating names, labels, codes or creative variations.",
          "Exploring multiple options before choosing a final result.",
        ],
        reviewChecks: [
          "Review generated ideas before using them publicly.",
          "Check availability, trademarks or originality when naming a business or product.",
          "Adjust generated results to match your own brand, audience or purpose.",
        ],
        limitation:
          "Generated results are suggestions and starting points. They may need editing, verification or originality checks before final use.",
      };

    default:
      return {
        intro:
          "Toollane tools are built to make common online tasks easier, faster and more accessible with a focused page for each task.",
        usefulFor: [
          "Completing a focused online task without installing extra software.",
          "Saving time on repetitive calculations, conversions or formatting work.",
          "Getting a practical result that can be copied, downloaded or applied.",
        ],
        reviewChecks: [
          "Review important results before using them in professional work.",
          "Check inputs carefully if the result depends on numbers, files or settings.",
          "Keep copies of important files, text or data before editing.",
        ],
        limitation:
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

  return (
    <section className="mt-12 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-black">
        About the {title}
      </h2>

      <div className="mt-5 space-y-5 leading-8 text-black/65">
        <p>{description}</p>

        <p>{content.intro}</p>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-black text-black">Useful for</h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-black/65">
              {content.usefulFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h3 className="text-lg font-black text-black">
              Before you rely on the result
            </h3>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-black/65">
              {content.reviewChecks.map((item) => (
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
            {content.limitation}
          </p>
        </div>
      </div>
    </section>
  );
}