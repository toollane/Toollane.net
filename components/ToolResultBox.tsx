type Props = {
  title?: string;
  value?: string | number;
  children?: React.ReactNode;
};

export default function ToolResultBox({
  title = "Result",
  value,
  children,
}: Props) {
  return (
    <div className="mt-6 rounded-3xl border border-black/10 bg-[#fff8df] p-5">
      <div className="text-sm font-bold uppercase tracking-wide text-black/40">
        {title}
      </div>

      {value !== undefined && (
        <div className="mt-3 break-words text-3xl font-black text-black">
          {value}
        </div>
      )}

      {children && (
        <div className="mt-4 text-sm leading-7 text-black/70">
          {children}
        </div>
      )}
    </div>
  );
}