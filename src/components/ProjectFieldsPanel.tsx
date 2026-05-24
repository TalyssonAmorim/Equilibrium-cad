import type { SiteConditions, YesNo } from '../types/project'
import { useProjectStore } from '../store/projectStore'

const CONDITION_LABELS: { key: keyof SiteConditions; label: string }[] = [
  { key: 'revPronto', label: 'Rev. pronto' },
  { key: 'pisoPronto', label: 'Piso pronto' },
  { key: 'furoTorneira', label: 'Furo de torneira' },
  { key: 'marcenariaPronta', label: 'Marcenaria pronta' },
]

export function ProjectFieldsPanel() {
  const project = useProjectStore((s) => s.project)
  const updateProjectFields = useProjectStore((s) => s.updateProjectFields)
  const setCondition = useProjectStore((s) => s.setCondition)

  if (!project) return null

  return (
    <section className="mb-4 rounded-lg border border-surface-border bg-surface p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
        Ficha Equilibrium
      </h3>
      <p className="mt-1 mb-3 text-[11px] text-text-muted">
        Dados usados no template ao salvar (PDF A4).
      </p>

      <div className="space-y-2">
        <label className="block text-xs text-text-muted">
          Cliente
          <input
            className="mt-1 w-full min-h-10 rounded-lg border border-surface-border bg-surface-elevated px-3 text-sm text-text"
            value={project.clientName ?? ''}
            onChange={(e) =>
              updateProjectFields({ clientName: e.target.value })
            }
          />
        </label>
        <label className="block text-xs text-text-muted">
          Endereço
          <input
            className="mt-1 w-full min-h-10 rounded-lg border border-surface-border bg-surface-elevated px-3 text-sm text-text"
            value={project.address ?? ''}
            onChange={(e) => updateProjectFields({ address: e.target.value })}
          />
        </label>
        <label className="block text-xs text-text-muted">
          Fone
          <input
            className="mt-1 w-full min-h-10 rounded-lg border border-surface-border bg-surface-elevated px-3 text-sm text-text"
            value={project.phone ?? ''}
            onChange={(e) => updateProjectFields({ phone: e.target.value })}
          />
        </label>
      </div>

      <p className="mt-3 mb-2 text-xs font-medium text-text">Condições da obra</p>
      <div className="space-y-2">
        {CONDITION_LABELS.map(({ key, label }) => (
          <ConditionToggle
            key={key}
            label={label}
            value={project.conditions[key]}
            onChange={(v) => setCondition(key, v)}
          />
        ))}
      </div>
    </section>
  )
}

function ConditionToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: YesNo
  onChange: (v: YesNo) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-text">{label}</span>
      <div className="flex gap-1">
        <ToggleBtn active={value === 'sim'} onClick={() => onChange('sim')}>
          Sim
        </ToggleBtn>
        <ToggleBtn active={value === 'nao'} onClick={() => onChange('nao')}>
          Não
        </ToggleBtn>
        <ToggleBtn active={value === null} onClick={() => onChange(null)}>
          —
        </ToggleBtn>
      </div>
    </div>
  )
}

function ToggleBtn({
  children,
  active,
  onClick,
}: {
  children: import('react').ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-8 min-w-10 rounded-md px-2 text-[11px] ${
        active
          ? 'bg-accent/25 font-semibold text-accent'
          : 'bg-surface-elevated text-text-muted'
      }`}
    >
      {children}
    </button>
  )
}
