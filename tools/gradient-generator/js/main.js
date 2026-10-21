(function () {
  'use strict'

  function init () {
    const get = id => document.getElementById(id)

    const controls = {
      make: get('makeGrad'),
 text: get('text'),
 info: get('info'),
 fixed: get('fixed'),
 radial: get('radial'),
 random: get('random'),
 reverse: get('revers'),
 repeat: get('repea'),
 softness: get('softness'),
 degree: get('degree'),
 colorInterval: get('rgbinterv'),
 gradientInterval: get('grainterv'),
 baseline: get('baseline'),
 opacity: get('opaci'),
 limit: get('safe'),
 r: get('r'),
 g: get('g'),
 b: get('b')
    }

    function number (element, fallback = 0) {
      const value = element.value.trim()

      if (value === '') return fallback

        const parsed = Number(value)
        return Number.isFinite(parsed) ? parsed : fallback
    }

    function clamp (value, min, max) {
      return Math.min(max, Math.max(min, value))
    }

    function randomInt (max) {
      return Math.floor(Math.random() * (Math.floor(max) + 1))
    }

    function getOpacity () {
      const value = controls.opacity.value.trim()

      // Preserve the original convention: 5 → 0.5, 75 → 0.75.
      // Also accept decimal values such as 0.5.
      if (!value || Number(value) === 0) return 1

        const opacity = value.includes('.')
        ? Number(value)
        : Number(`0.${value}`)

        return Number.isFinite(opacity)
        ? clamp(opacity, 0, 1)
        : 1
    }

    function makeGradient () {
      const reverse = controls.reverse.checked
      const repeating = controls.repeat.checked
      const random = controls.random.checked

      const softness = Math.max(0, number(controls.softness))
      const degree = number(controls.degree)
      const colorInterval = Math.max(
        0,
        number(controls.colorInterval, 10)
      )
      const gradientInterval = Math.max(
        1,
        number(controls.gradientInterval, 10)
      )
      const baseline = reverse
      ? 0
      : Math.max(0, number(controls.baseline))

      const limit = clamp(
        Math.floor(number(controls.limit, 100)),
                          0,
                          10000
      )

      const opacity = getOpacity()

      let r = clamp(number(controls.r), 0, 255)
      let g = clamp(number(controls.g), 0, 255)
      let b = clamp(number(controls.b), 0, 255)

      let colors = []

      for (let i = 0; i < limit; i++) {
        r += random ? randomInt(colorInterval) : colorInterval
        g += random ? randomInt(colorInterval) : colorInterval
        b += random ? randomInt(colorInterval) : colorInterval

        if (r >= 255 || g >= 255 || b >= 255) break

          // Preserve the original behaviour of skipping the first two.
          if (i >= 2) {
            colors.push([r, g, b])
          }
      }

      // Always produce a valid gradient.
      if (colors.length === 0) {
        colors.push([
          clamp(r, 0, 255),
                    clamp(g, 0, 255),
                    clamp(b, 0, 255)
        ])
      }

      if (reverse) {
        colors = colors.concat(colors.slice(1, -1).reverse())
      }

      const stops = []
      let previousEnd = 0
      let firstColor = ''

      colors.forEach((color, i) => {
        const isBaseline = baseline > 0 && i % 3 === 0
        const rgb = isBaseline ? [0, 0, 0] : color
        const alpha = isBaseline && opacity === 1 ? 0 : opacity

        const cssColor = `rgba(${rgb.join(', ')}, ${alpha})`

        const start = i === 0 ? 0 : previousEnd + softness
        const extra = isBaseline ? Math.max(0, baseline - 2) : 0
        const end = start + gradientInterval + extra

        stops.push(`${cssColor} ${start}px ${end}px`)

        if (i === 0) firstColor = cssColor

          previousEnd = end
      })

      if (repeating && colors.length > 1) {
        const start = previousEnd + softness

        // The first interval of the next cycle continues this colour.
        stops.push(`${firstColor} ${start}px`)
      }

      const prefix = repeating ? 'repeating-' : ''

      const gradient = controls.radial.checked
      ? `${prefix}radial-gradient(circle at 50% 50%, ${stops.join(', ')})`
      : `${prefix}linear-gradient(${degree}deg, ${stops.join(', ')})`

      document.body.style.background = gradient
      document.body.style.backgroundAttachment =
      controls.fixed.checked ? 'fixed' : 'scroll'

      controls.info.textContent = colors.length

      controls.text.textContent =
      `background: ${gradient}${controls.fixed.checked ? ' fixed' : ''};`
    }

    async function copyText (event) {
      if (event.detail !== 3) return

        const text = controls.text.textContent

        try {
          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
          } else {
            const textarea = document.createElement('textarea')

            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            textarea.readOnly = true

            document.body.appendChild(textarea)

            try {
              textarea.select()

              if (!document.execCommand('copy')) {
                throw new Error('Copy command failed')
              }
            } finally {
              textarea.remove()
            }
          }

          console.log('Gradient copied')
        } catch (error) {
          console.error('Unable to copy gradient:', error)
        }
    }

    controls.make.addEventListener('click', event => {
      event.preventDefault()
      makeGradient()
    })

    controls.text.addEventListener('click', copyText)

    makeGradient()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
})()
