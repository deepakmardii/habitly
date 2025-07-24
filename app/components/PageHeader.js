export default function PageHeader({ title, subtitle }) {
  return (
    <div className="w-full max-w-4xl mt-8 mb-8 mx-auto">
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
} 