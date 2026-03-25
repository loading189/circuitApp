import { ComponentLibrary } from '@/components/parts/ComponentLibrary';

export const LeftSidebar = (): JSX.Element => {
  return (
    <aside className="panel-shell w-[300px] p-3">
      <section>
        <h2 className="panel-title">Tooling</h2>
        <p className="text-xs text-token-secondary">Use the on-canvas tool bar for Select, Wire, Probe, Pan, and Reset View.</p>
      </section>
      <ComponentLibrary />
    </aside>
  );
};
