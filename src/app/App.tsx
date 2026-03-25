import { useEffect } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { LeftSidebar } from '@/components/layout/LeftSidebar';
import { RightSidebar } from '@/components/layout/RightSidebar';
import { Workbench } from '@/components/workspace/Workbench';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';

export const App = (): JSX.Element => {
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const setSelectedComponentId = useSelectionStore((state) => state.setSelectedComponentId);
  const deleteComponent = useComponentPlacementStore((state) => state.deleteComponent);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedComponentId) {
        deleteComponent(selectedComponentId);
        setSelectedComponentId(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteComponent, selectedComponentId, setSelectedComponentId]);

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
