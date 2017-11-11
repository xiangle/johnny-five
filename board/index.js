let config = require('./config.json')
let five = require("johnny-five")
let board = new five.Board()

global.App = {
   five, board, config,
   Led: {},
   Button: {},
   Sensor: {},
   Actuator: {},
}

let { Led, Button, Sensor, Actuator } = App

board.on("ready", async function () {

   // 创建指示灯
   for (let pin in config.led) {
      Led[`L${pin}`] = new five.Led(pin)
      let item = config.led[pin]
      if (item.default === true) {
         Led[`L${pin}`].on()
      } else {
         Led[`L${pin}`].off()
      }
   }

   // 创建按钮
   for (let pin in config.button) {
      let item = config.button[pin]
      item.pin = pin
      Button[`B${pin}`] = new five.Button(item)
   }

   // 创建传感器
   for (let pin in config.sensor) {
      Sensor[`S${pin}`] = new five.Sensor(`A${pin}`)
      let item = config.sensor[pin]
      if (item.limit) {
         let difference = item.stroke.max - item.stroke.min
         item.$limit = {
            min: item.stroke.min + Math.round(difference * (item.limit.min * 0.01)),
            max: item.stroke.min + Math.round(difference * (item.limit.max * 0.01)),
            expect: item.stroke.min + Math.round(difference * (item.limit.expect * 0.01)),
         }
      }
   }

   console.log(config.sensor[0])
   return

   // 创建执行器
   for (let pin in config.actuator) {
      Actuator[`A${pin}`] = new five.Pin(pin)
   }

   // 检查指示灯
   // await new Promise(function (resolve, reject) {
   //    setTimeout(resolve, 3000)
   // }).then(() => {
   //    for (let pin in config.led) {
   //       let item = config.led[pin]
   //       if (!item.default) {
   //          Led[`L${pin}`].off()
   //       }
   //    }
   // })

   require("./control.js")

})
