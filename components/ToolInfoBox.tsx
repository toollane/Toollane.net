type Props = {
  children: React.ReactNode;
};

export default function ToolInfoBox({ children }: Props) {
  return (
    <div className="mt-6 rounded-3xl border border-black/10 bg-white/70 p-5 text-sm leading-7 text-black/65">
      {children}
    </div>
  );
}