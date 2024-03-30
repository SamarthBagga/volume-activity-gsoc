define([
  'sugar-web/graphics/palette',
  'text!activity/palettes/volumepalette.html',
], function (palette, template) {
  var volumepalette = {}
  volumepalette.VolumePalette = function (invoker, primaryText) {
    palette.Palette.call(this, invoker, primaryText)
    this.getPalette().id = 'volume-palette'

    var containerElem = document.createElement('div')
    containerElem.innerHTML = template

    this.setContent([containerElem])

    this.bgSelectedEvent = document.createEvent('CustomEvent')
    this.bgSelectedEvent.initCustomEvent('volume-selected', true, true, {
      bg: '',
    })

    let that = this
    let backgroundChangeCallback = null

    var cube = document.getElementById('cube')
    var tetra = document.getElementById('tetra')
    var octa = document.getElementById('octa')

    // Add click event listeners to each div
    cube.addEventListener('click', function () {
        console.log("hello form cube")
      if (!cube.classList.contains('active')) {
        cube.classList.add('active')
        tetra.classList.remove('active')
        octa.classList.remove('active')
      }
    })

    tetra.addEventListener('click', function () {
      if (!tetra.classList.contains('active')) {
        tetra.classList.add('active')
        cube.classList.remove('active')
        octa.classList.remove('active')
      }
    })

    octa.addEventListener('click', function () {
      if (!octa.classList.contains('active')) {
        octa.classList.add('active')
        cube.classList.remove('active')
        tetra.classList.remove('active')
      }
    })
  }

  var addEventListener = function (type, listener, useCapture) {
    console.log('adding event listener')
    return this.getPalette().addEventListener(type, listener, useCapture)
  }

  volumepalette.VolumePalette.prototype = Object.create(
    palette.Palette.prototype,
    {
      addEventListener: {
        value: addEventListener,
        enumerable: true,
        configurable: true,
        writable: true,
      },
    },
  )

  return volumepalette
})
