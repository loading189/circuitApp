import { useMemo, useState } from 'react';
import { ComponentPreview } from '@/components/inspector/ComponentPreview';
import { useSelectionStore } from '@/features/board/selectionStore';
import { useComponentPlacementStore } from '@/features/components/componentPlacement';
import { formatResistance, parseResistanceInput, RESISTOR_PRESET_VALUES, resistorBandCode } from '@/features/components/resistorPresets';
import { useWireStore } from '@/features/wiring/wirePlacement';
import { WIRE_COLOR_HEX, type WireColor } from '@/features/wiring/wireTypes';

export const InspectorPanel = (): JSX.Element => {
  const selectedComponentId = useSelectionStore((state) => state.selectedComponentId);
  const selectedWireId = useSelectionStore((state) => state.selectedWireId);
  const setSelectedComponentId = useSelectionStore((state) => state.setSelectedComponentId);
  const setSelectedWireId = useSelectionStore((state) => state.setSelectedWireId);

  const component = useComponentPlacementStore((state) => state.components.find((candidate) => candidate.id === selectedComponentId));
  const rotate = useComponentPlacementStore((state) => state.rotateSelectedComponent);
  const delComponent = useComponentPlacementStore((state) => state.deleteComponent);
  const setResistorValue = useComponentPlacementStore((state) => state.setResistorValue);

  const wire = useWireStore((state) => state.wires.find((candidate) => candidate.id === selectedWireId));
  const delWire = useWireStore((state) => state.deleteWire);
  const updateWireColor = useWireStore((state) => state.updateWireColor);

  const [resistorDraft, setResistorDraft] = useState('');

  const info = useMemo(() => {
    if (!component) {
      return null;
    }

    if (component.type === 'resistor') {
      return formatResistance(component.props.resistanceOhms);
    }
    if (component.type === 'capacitor') {
      return `${component.props.capacitanceUf}μF`;
    }
    if (component.type === 'dc-power-supply') {
      return `${component.props.voltage.toFixed(1)}V`;
    }
    return component.name;
  }, [component]);

  return (
    <section className="rounded-lg border border-slate-800 bg-bench-900/80 p-3">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">Inspector</h3>
      {!component && !wire ? (
        <p className="text-xs text-slate-400">Select a component or wire to inspect properties.</p>
      ) : null}

      {wire ? (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-slate-100">Jumper Wire</p>
            <p className="text-xs text-cyan-300">{wire.startHoleId} → {wire.endHoleId}</p>
          </div>
          <div className="flex items-center gap-1">
            {(Object.keys(WIRE_COLOR_HEX) as WireColor[]).map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => updateWireColor(wire.id, color)}
                className={`h-4 w-4 rounded-full border ${wire.color === color ? 'border-white ring-1 ring-cyan-300' : 'border-slate-500'}`}
                style={{ backgroundColor: WIRE_COLOR_HEX[color] }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              delWire(wire.id);
              setSelectedWireId(null);
            }}
            className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:border-rose-400"
          >
            Delete Wire
          </button>
        </div>
      ) : null}

      {component ? (
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium text-slate-100">{component.type}</p>
            <p className="text-xs text-cyan-300">{info}</p>
          </div>
          <ComponentPreview component={component} />
          <p className="text-xs text-slate-400">Terminals: {component.terminals.map((t) => t.holeId).join(' · ')}</p>

          {component.type === 'resistor' ? (
            <div className="space-y-2 rounded border border-slate-700 p-2">
              <p className="text-xs text-slate-300">Bands: {resistorBandCode(component.props.resistanceOhms)}</p>
              <div className="flex flex-wrap gap-1">
                {RESISTOR_PRESET_VALUES.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setResistorValue(component.id, value)}
                    className="rounded border border-slate-700 px-1.5 py-0.5 text-[11px] hover:border-cyan-400"
                  >
                    {formatResistance(value)}
                  </button>
                ))}
              </div>
              <div className="flex gap-1">
                <input
                  value={resistorDraft}
                  onChange={(event) => setResistorDraft(event.target.value)}
                  placeholder="Custom (e.g. 2.2k)"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const parsed = parseResistanceInput(resistorDraft);
                    if (parsed) {
                      setResistorValue(component.id, parsed);
                    }
                  }}
                  className="rounded border border-cyan-700 px-2 py-1 text-xs text-cyan-200"
                >
                  Apply
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Common uses: LED limiting (220Ω–1kΩ), pull-ups (4.7kΩ–10kΩ), dividers/timing.</p>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button type="button" onClick={() => rotate(component.id)} className="rounded border border-slate-700 px-2 py-1 text-xs hover:border-cyan-400">Rotate</button>
            <button
              type="button"
              onClick={() => {
                delComponent(component.id);
                setSelectedComponentId(null);
              }}
              className="rounded border border-rose-700 px-2 py-1 text-xs text-rose-300 hover:border-rose-400"
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};
