export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#fff8df] text-[#171717]">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-black/10 bg-white/80 p-8 shadow-sm backdrop-blur sm:p-12">
          <h1 className="text-4xl font-black tracking-tight">
            Privacy Policy
          </h1>

          <div className="mt-8 space-y-8 text-black/70 leading-8">
            <p>
              Toollane respects your privacy.
            </p>

            <p>
              Many tools on this website process data directly in your browser
              and do not upload files to external servers.
            </p>

            <p>
              We may use analytics and advertising services such as Google
              AdSense in the future to improve the website experience.
            </p>

            <p>
              Third-party vendors, including Google, may use cookies to serve
              ads based on prior visits to this website.
            </p>

            <p>
              By using this website, you agree to this privacy policy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}