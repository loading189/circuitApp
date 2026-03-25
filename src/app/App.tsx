import { useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Workbench } from '@/components/workspace/Workbench';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { useWireStore } from '@/features/wiring/wirePlacement';

export const App = (): JSX.Element => {
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const selectedWireId = useSelectionStore((state) => state.selectedWireId);
  const setSelectedComponentId = useSelectionStore((state) => state.setSelectedComponentId);
  const setSelectedWireId = useSelectionStore((state) => state.setSelectedWireId);
  const deleteComponent = useComponentPlacementStore((state) => state.deleteComponent);
  const deleteWire = useWireStore((state) => state.deleteWire);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Delete' && event.key !== 'Backspace') {
        return;
      }

      if (selectedWireId) {
        deleteWire(selectedWireId);
        setSelectedWireId(null);
        return;
      }

      if (selectedComponentId) {
        deleteComponent(selectedComponentId);
        setSelectedComponentId(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteComponent, deleteWire, selectedComponentId, selectedWireId, setSelectedComponentId, setSelectedWireId]);

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="flex h-[calc(100vh-70px)] min-h-0 gap-3 p-3">
        <LeftSidebar />
        <Workbench />
        <RightSidebar />
      </div>
    </div>
  );
};
