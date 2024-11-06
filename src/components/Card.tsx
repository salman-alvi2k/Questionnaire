import Image from "next/image";

type OptionCardProps = {
  label: string;
  imageSrc: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({
  label,
  imageSrc,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`flex flex-col items-center p-4 rounded-lg cursor-pointer ${
        selected ? "bg-gray-700 border-2 border-white" : "bg-gray-800"
      }`}
    >
      <h3 className="text-sm font-semibold text-white">{label}</h3>
      <Image src={imageSrc} alt={label} width={500} height={300} priority />
    </div>
  );
}
