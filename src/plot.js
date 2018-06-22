var plot = require('plotter').plot
var log = require('winston')

var Plot = function(plotConf){
  //this.path = plotConf.path
  Object.assign(this,plotConf)
}

Plot.prototype.plot = function(what, data, meta){
  let that = this
  new Promise((resolve, reject) => {
    log.info(`plotting ${what}`)
    let args = Object.assign({}, meta)
    Object.assign(args,{
        data:	data,
        filename:	`${that.path}${what}.${that.format}`,
        format: that.format
    })
    plot(args);
    resolve()
  });

}


module.exports = Plot
