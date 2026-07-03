export default function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-baseline gap-3.5 mt-[60px] mb-[26px]">
      <h2 className="text-2xl font-bold tracking-[-0.01em]">{title}</h2>
      <div className="flex-1 h-px bg-edge" />
    </div>
  );
}
