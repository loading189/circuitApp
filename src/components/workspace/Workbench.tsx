import { BreadboardSvg } from '@/components/breadboard/BreadboardSvg';

export const Workbench = (): JSX.Element => {
  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <BreadboardSvg />
    </main>
  );
};
