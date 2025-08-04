export default function ContactSection() {
    return (
      <section className="mt-12">
        <h3 className="text-xl font-semibold mb-3">How to contact</h3>
        <p className="text-gray-700">
          If you're interested, please{" "}
          <a
            href="https://your-contact-link.com"
            className="text-indigo-600 underline font-medium"
          >
            send me a message
          </a>
          .
        </p>
        <p className="text-sm text-gray-500 mt-2">
          P.S. If you know the right person, please{" "}
          <a
            href="https://your-contact-link.com"
            className="text-indigo-600 underline"
          >
            make an intro or share
          </a>{" "}
          with them!
        </p>
      </section>
    );
  }
  