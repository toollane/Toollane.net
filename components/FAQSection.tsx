type FAQ = {
  question: string;

  answer: string;
};

type Props = {
  faqs: FAQ[];
};

export default function FAQSection({
  faqs,
}: Props) {
  return (
    <section className="mt-20">

      <h2 className="text-3xl font-bold mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-6">

        {faqs.map((faq) => (
          <div
            key={faq.question}
            className="border rounded-2xl p-6"
          >

            <h3 className="text-xl font-semibold mb-3">
              {faq.question}
            </h3>

            <p className="text-gray-700 leading-7">
              {faq.answer}
            </p>

          </div>
        ))}

      </div>

    </section>
  );
}