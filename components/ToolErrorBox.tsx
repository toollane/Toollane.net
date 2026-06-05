type Props = {
  message: string;
};

export default function ToolErrorBox({ message }: Props) {
  return (
    <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm font-medium leading-7 text-red-700">
      {message}
    </div>
  );
}