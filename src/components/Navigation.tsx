import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 p-4 bg-gray-900">
      <div className="max-w-4xl mx-auto flex gap-4">
        <Link href="/" className="text-white hover:text-lime-500">
          Home
        </Link>
        <Link href="/about" className="text-white hover:text-lime-500">
          About
        </Link>
        <Link href="/survey" className="text-white hover:text-lime-500">
          Survey
        </Link>
      </div>
    </nav>
  );
} 