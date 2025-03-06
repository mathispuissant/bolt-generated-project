import React, { useState, useRef, useEffect } from 'react'
import { computeDotProduct, computeAngle } from './vectorMath'

const Canvas = ({ u, v }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    // Origine au centre
    const originX = width / 2
    const originY = height / 2

    // Facteur d'échelle (pixels par unité)
    const scale = 40

    // Dessiner les graduations de la grille
    ctx.strokeStyle = '#eee'
    ctx.lineWidth = 1
    // Lignes verticales
    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let x = originX % scale; x > 0; x -= scale) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    // Lignes horizontales
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    for (let y = originY % scale; y > 0; y -= scale) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Dessiner les axes
    ctx.strokeStyle = '#ccc'
    ctx.lineWidth = 2
    // Axe des X
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()
    // Axe des Y
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()

    // Marquages et labels sur les axes
    ctx.fillStyle = 'black'
    ctx.font = '10px sans-serif'
    // Axe des X
    for (let x = originX; x < width; x += scale) {
      ctx.beginPath()
      ctx.moveTo(x, originY - 5)
      ctx.lineTo(x, originY + 5)
      ctx.stroke()
      if (x !== originX) {
        ctx.fillText(((x - originX) / scale).toString(), x - 3, originY + 15)
      }
    }
    for (let x = originX; x > 0; x -= scale) {
      ctx.beginPath()
      ctx.moveTo(x, originY - 5)
      ctx.lineTo(x, originY + 5)
      ctx.stroke()
      if (x !== originX) {
        ctx.fillText((-(originX - x) / scale).toString(), x - 10, originY + 15)
      }
    }
    // Axe des Y
    for (let y = originY; y < height; y += scale) {
      ctx.beginPath()
      ctx.moveTo(originX - 5, y)
      ctx.lineTo(originX + 5, y)
      ctx.stroke()
      if (y !== originY) {
        ctx.fillText(((originY - y) / scale).toString(), originX + 8, y + 3)
      }
    }
    for (let y = originY; y > 0; y -= scale) {
      ctx.beginPath()
      ctx.moveTo(originX - 5, y)
      ctx.lineTo(originX + 5, y)
      ctx.stroke()
      if (y !== originY) {
        ctx.fillText(((originY - y) / scale).toString(), originX + 8, y + 3)
      }
    }

    // Dessiner le vecteur u (bleu)
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    const uX = u.length * Math.cos(u.angle) * scale
    const uY = -u.length * Math.sin(u.angle) * scale
    ctx.lineTo(originX + uX, originY + uY)
    ctx.stroke()
    drawArrowHead(ctx, originX, originY, originX + uX, originY + uY, 'blue')
    // Afficher le label "u"
    ctx.fillStyle = 'blue'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText('u', originX + uX + 5, originY + uY - 5)

    // Dessiner le vecteur v (vert)
    ctx.strokeStyle = 'green'
    ctx.beginPath()
    ctx.moveTo(originX, originY)
    const vX = v.length * Math.cos(v.angle) * scale
    const vY = -v.length * Math.sin(v.angle) * scale
    ctx.lineTo(originX + vX, originY + vY)
    ctx.stroke()
    drawArrowHead(ctx, originX, originY, originX + vX, originY + vY, 'green')
    // Afficher le label "v"
    ctx.fillStyle = 'green'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText('v', originX + vX + 5, originY + vY - 5)

    // Dessiner l'arc représentant l'angle entre les vecteurs
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(originX, originY, 30, -u.angle, -v.angle, u.angle > v.angle)
    ctx.stroke()
  }, [u, v])

  const drawArrowHead = (ctx, fromX, fromY, toX, toY, color) => {
    const headlen = 10
    const dx = toX - fromX
    const dy = toY - fromY
    const angle = Math.atan2(dy, dx)
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6))
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6))
    ctx.lineTo(toX, toY)
    ctx.fill()
  }

  return <canvas ref={canvasRef} width={600} height={400} style={{ border: '1px solid #000' }} />
}

const App = () => {
  const [u, setU] = useState({ length: 5, angle: Math.PI / 6 })
  const [v, setV] = useState({ length: 4, angle: Math.PI / 3 })

  const dot = computeDotProduct(u, v)
  const angleBetween = computeAngle(u, v) * (180 / Math.PI)

  return (
    <div className="app">
      <h1>Visualiseur Interactif du Produit Scalaire</h1>

      <section>
        <h2>Introduction</h2>
        <p>Manipulez le vecteur u sur le plan interactif. Les translations montrent la somme des vecteurs.</p>
        <Canvas u={u} v={v} />
      </section>

      <section>
        <h2>Produit Scalaire: Définition Géométrique</h2>
        <div className="controls">
          <div>
            <label>Longueur de u: {u.length}</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={u.length}
              onChange={e => setU({ ...u, length: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label>Angle de u (deg): {(u.angle * 180 / Math.PI).toFixed(0)}</label>
            <input
              type="range"
              min="0"
              max="360"
              value={(u.angle * 180 / Math.PI).toFixed(0)}
              onChange={e => setU({ ...u, angle: parseFloat(e.target.value) * Math.PI / 180 })}
            />
          </div>
          <div>
            <label>Longueur de v: {v.length}</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={v.length}
              onChange={e => setV({ ...v, length: parseFloat(e.target.value) })}
            />
          </div>
          <div>
            <label>Angle de v (deg): {(v.angle * 180 / Math.PI).toFixed(0)}</label>
            <input
              type="range"
              min="0"
              max="360"
              value={(v.angle * 180 / Math.PI).toFixed(0)}
              onChange={e => setV({ ...v, angle: parseFloat(e.target.value) * Math.PI / 180 })}
            />
          </div>
        </div>
        <div className="dot-info">
          <p>u ⋅ v = {dot.toFixed(2)}</p>
          <p>Angle entre u et v: {angleBetween.toFixed(0)}°</p>
        </div>
      </section>

      <section>
        <h2>Interprétation du Produit Scalaire</h2>
        <div className="buttons">
          <button onClick={() => {
            setU({ ...u, angle: 0 })
            setV({ ...v, angle: 0 })
          }}>Parallèles</button>
          <button onClick={() => {
            setU({ ...u, angle: 0 })
            setV({ ...v, angle: Math.PI / 2 })
          }}>Perpendiculaires</button>
          <button onClick={() => {
            setU({ ...u, angle: 0 })
            setV({ ...v, angle: Math.PI })
          }}>Opposés</button>
        </div>
      </section>

      <section>
        <h2>Propriétés Algébriques</h2>
        <p>Vérifiez la distributivité et le carré d'une somme.</p>
        <p>Exemple: (u + v)² = u² + 2 u ⋅ v + v²</p>
      </section>
    </div>
  )
}

export default App
