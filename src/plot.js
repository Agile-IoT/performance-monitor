var plot = require('plotter').plot
var log = require('winston')
var fs = require('fs');

var Plot = function(plotConf){
  //this.path = plotConf.path

  Object.assign(this,plotConf)
  if (!fs.existsSync(this.path)) {
      throw Error(`folder path for plotting does not exist!: ${this.path}`)
  }

}

function checkformat(data){
  let ok = true
  Object.keys(data).forEach((v)=>{
    data[v].forEach((value)=>{
      if(isNaN(value)){
        ok = false
      }
    })
  })
  return ok;

}
Plot.prototype.plot = function(what, data, meta){
  let that = this
  new Promise((resolve, reject) => {

    if(!data || data.length ==0 || !checkformat(data)){
      log.error(`something broke... `)
      log.error(`${what} does not contain any data! cannot plot it`)
      return reject(`${what} does not contain any data! cannot plot it`)
    } else {
      log.info(`plotting ${what}`)
      let args = Object.assign({}, meta)
      Object.assign(args,{
          data:	data,
          filename:	`${that.path}${what}.${that.format}`,
          format: that.format
      })
      plot(args);
      return resolve();
    }
  });

}


module.exports = Plot
