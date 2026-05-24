import { useEffect } from 'react'
import type { Project, YesNo } from '../types/project'

interface EquilibriumTemplateProps {
  project: Project
  drawingUrl: string | null
  onReady?: () => void
}

function ConditionRow({
  label,
  value,
}: {
  label: string
  value: YesNo
}) {
  return (
    <tr>
      <td style={{ padding: '3px 4px', fontSize: 11 }}>{label}</td>
      <td style={{ textAlign: 'center', width: 36, fontSize: 12 }}>
        {value === 'sim' ? '☑' : '☐'}
      </td>
      <td style={{ textAlign: 'center', width: 36, fontSize: 12 }}>
        {value === 'nao' ? '☑' : '☐'}
      </td>
    </tr>
  )
}

const gridStyle: React.CSSProperties = {
  backgroundImage: `
    linear-gradient(to right, #d1d5db 1px, transparent 1px),
    linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
  `,
  backgroundSize: '18px 18px',
  backgroundColor: '#fff',
}

export function EquilibriumTemplate({
  project,
  drawingUrl,
  onReady,
}: EquilibriumTemplateProps) {
  const { conditions } = project

  useEffect(() => {
    if (!drawingUrl) {
      onReady?.()
      return
    }
    const img = new Image()
    img.onload = () => onReady?.()
    img.onerror = () => onReady?.()
    img.src = drawingUrl
  }, [drawingUrl, onReady])

  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        background: '#fff',
        color: '#000',
        fontFamily: 'Georgia, "Times New Roman", serif',
        padding: 28,
        boxSizing: 'border-box',
      }}
    >
      {/* Cabeçalho */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          border: '2px solid #000',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Equilibrium
            <br />
            Mármores e Granitos
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Arial, sans-serif',
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>📍</span>
            <span>
              C.A Arniqueira, Ch. 89/2, Lt. 19 — Arniqueiras/DF
            </span>
          </div>
        </div>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'Arial, sans-serif',
            textAlign: 'right',
            lineHeight: 1.6,
          }}
        >
          <div>
            <strong>Bira</strong> (61) 9 9989-5384
          </div>
          <div>
            <strong>Daniel</strong> (61) 9 9904-2772
          </div>
        </div>
      </div>

      {/* Cliente + condições */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            flex: 1,
            border: '2px solid #000',
            borderRadius: 14,
            padding: '10px 14px',
            fontFamily: 'Arial, sans-serif',
            fontSize: 12,
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong>Cliente:</strong>{' '}
            <span>{project.clientName || ' '}</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>Endereço:</strong>{' '}
            <span>{project.address || ' '}</span>
          </div>
          <div>
            <strong>Fone:</strong> <span>{project.phone || ' '}</span>
          </div>
        </div>
        <div
          style={{
            width: 220,
            border: '2px solid #000',
            borderRadius: 14,
            padding: '8px 10px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 6,
            }}
          >
            Condições da Obra
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ fontSize: 9, fontWeight: 600 }}>
                <td />
                <td style={{ textAlign: 'center' }}>Sim</td>
                <td style={{ textAlign: 'center' }}>Não</td>
              </tr>
            </thead>
            <tbody>
              <ConditionRow
                label="Rev. pronto"
                value={conditions.revPronto}
              />
              <ConditionRow
                label="Piso pronto"
                value={conditions.pisoPronto}
              />
              <ConditionRow
                label="Furo de torneira"
                value={conditions.furoTorneira}
              />
              <ConditionRow
                label="Marcenaria pronta"
                value={conditions.marcenariaPronta}
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Área de desenho */}
      <div
        style={{
          border: '2px solid #000',
          borderRadius: 14,
          padding: 8,
          marginBottom: 12,
          height: 520,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            ...gridStyle,
            width: '100%',
            height: '100%',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {drawingUrl && (
            <img
              src={drawingUrl}
              alt="Croqui técnico"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          )}
        </div>
      </div>

      {/* Rodapé */}
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 8,
          lineHeight: 1.35,
          textAlign: 'justify',
          marginBottom: 10,
        }}
      >
        O granito e o mármore são produtos da natureza e por isso não podem ser
        padronizados em cor, tom e desenhos das veios. Por essa razão, não
        poderão ser recusados quando apresentarem estas variações naturais.
      </div>
      <div
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: 28,
        }}
      >
        Declaro estar de acordo com as medidas, detalhes e condições deste
        pedido.
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontFamily: 'Arial, sans-serif',
          fontSize: 9,
          textAlign: 'center',
        }}
      >
        {[
          'ASSINATURA DO CLIENTE',
          'ASSINATURA DO RECEBEDOR',
          'ASSINATURA DO VENDEDOR',
        ].map((label) => (
          <div key={label} style={{ flex: 1 }}>
            <div
              style={{
                borderTop: '1px solid #000',
                marginTop: 32,
                paddingTop: 4,
              }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
