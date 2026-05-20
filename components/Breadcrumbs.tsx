import Link from "next/link";

type Props = {
  categoryName: string;

  categorySlug: string;

  toolName: string;
};

export default function Breadcrumbs({
  categoryName,
  categorySlug,
  toolName,
}: Props) {
  return (
    <nav className="text-sm text-gray-500 mb-8">

      <div className="flex flex-wrap items-center gap-2">

        <Link
          href="/"
          className="hover:text-black"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          href={`/category/${categorySlug}`}
          className="hover:text-black"
        >
          {categoryName}
        </Link>

        <span>/</span>

        <span className="text-black">
          {toolName}
        </span>

      </div>

    </nav>
  );
}