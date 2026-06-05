type Props = {
  title: string;
  description: string;
};

export default function ToolContentSection({
  title,
  description,
}: Props) {
  return (
    <section className="mt-14 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8">
      <h2 className="text-2xl font-black tracking-tight text-black">
        About the {title}
      </h2>

      <div className="mt-6 space-y-6 leading-8 text-black/65">
        <p>{description}</p>

        <p>
          The {title.toLowerCase()} is a free online tool designed to deliver
          fast and accurate results directly in your browser. It works on
          desktop, tablet and mobile devices without requiring downloads,
          software installation or account creation.
        </p>

        <p>
          Toollane focuses on speed, simplicity and usability. The tool is built
          to help users complete common tasks quickly while maintaining a clean
          interface and responsive experience across all devices.
        </p>

        <p>
          Whether you are working on personal projects, business tasks,
          education, content creation or professional workflows, the{" "}
          {title.toLowerCase()} helps save time and improve productivity through
          a straightforward and reliable process.
        </p>

        <p>
          Many online tools are overloaded with unnecessary features, excessive
          advertising and slow interfaces. Toollane prioritizes performance,
          privacy and ease of use so users can focus on getting results.
        </p>
      </div>
    </section>
  );
}