# Marmoraria CAD

PWA touch-first para croquis técnicos de cozinhas, bancadas e projetos em mármore/granito — otimizado para tablets Android com S Pen (ex.: Galaxy Tab S10 FE).

## Stack

- React + TypeScript
- Tailwind CSS v4
- React-Konva (canvas)
- Zustand (estado)
- IndexedDB via `idb` (persistência local)
- jsPDF (exportação PDF)

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra no tablet ou emulador Chrome com modo dispositivo touch. Para instalar como PWA: menu do navegador → “Instalar app”.

## Build

```bash
npm run build
npm run preview
```

## Arquitetura

```
src/
  canvas/       # Stage, camadas, câmera virtual
  tools/        # Ferramentas (select, pan, line, rect…)
  store/        # Zustand (projeto + canvas)
  components/   # UI (toolbar, sidebars, diálogos)
  types/        # Entidades tipadas (shapes, project)
  hooks/        # Pointer events, viewport, atalhos
  utils/        # Câmera, grid snap, mm, DB, export
```

### Camadas Konva

1. **GridLayer** — grade infinita 10/100 mm (viewport culling)
2. **DrawingLayer** — linhas, retângulos, texto
3. **MeasurementLayer** — cotas automáticas
4. **UILayer** — preview de desenho e seleção

### Gestos

| Gesto | Ação |
|--------|------|
| S Pen / mouse + ferramenta desenho | Linha, retângulo |
| Círculo (C) | Centro + arraste para definir o raio |
| Seleção + alças | Redimensiona retângulo, círculo ou linha selecionada |
| Desfazer (↶ ou Ctrl+Z) | Volta última alteração |
| 2 dedos | Pan + pinch zoom |
| Ferramenta Pan | Arrastar com 1 dedo |
| Snap | Grade 10 mm (toggle na toolbar) |

Coordenadas em **milímetros** no mundo; escala da câmera em px/mm.

## Próximos passos sugeridos

- Ferramentas texto e medida dedicadas
- Edição de vértices / drag de shapes
- Sincronização em nuvem
- Templates de cozinha e biblioteca de materiais
- PWA icons (`public/pwa-192.png`, `pwa-512.png`)
