var fs = require('fs')
var os = require('os');
var log = require('winston');

var Stream = function(id, names, image, stream){
  this.id = id
  this.name = names[0]
  this.image = image
  this.stream = stream
  this.path = os.tmpdir()
  this.file_base = `${this.path}/perf_${this.name.substring(1)}_${this.id}`
  //used to not have a first cpu high measurement due to lack of previous cpu values
  this.started = false
  try{
    fs.unlinkSync(`${this.file_base}`)
    fs.unlinkSync(`${this.file_base}_stats`)
    log.debug(`previous file ${this.file_base} for container ${this.name} has been deleted`)

  } catch(err) {
    log.debug(`previous file ${this.file_base} for container ${this.name} was not there... no problem we move on`)
  }

  log.debug(`using file ${this.file_base} for container ${this.name}`)

}

Stream.prototype.listen  =  function(){
  let that = this
  var chunk = ''
  that.stream.on('data',(s)=>{
    if(!this.started){
      this.started = true
    } else {
      log.debug(`stats obtained from docker ${s.toString()}`)

      chunk = chunk + s.toString()
      try{
        let d = JSON.parse(s.toString())
        fs.appendFile(`${this.file_base}_stats`, s.toString(), (err) => {
          if (err) throw err;
        });
        //log.debug(`storage_stats ${JSON.stringify(d.storage_stats)}`)
        let rx = 0
        let tx = 0
        if(d.networks){
          rx = d.networks.eth0.rx_bytes
          tx = d.networks.eth0.tx_bytes
        }
        let line = `${d.name},${rx},${tx},${d.memory_stats.usage},${d.cpu_stats.cpu_usage.total_usage-d.precpu_stats.cpu_usage.total_usage}\n`
        fs.appendFile(`${this.file_base}`, line, (err) => {
          if (err) throw err;
        });
        chunk = ''
      } catch(err){
        //maybe next time
        log.debug(`chunk is not a valid JSON object yet...`)
        log.debug(`...`)
      }


    }

  })
}

Stream.prototype.close = function(){
  return this.stream.destroy();
}


Stream.prototype.getNetRxRow = function(){
  return this.getColumnFromTemp(1)
}

Stream.prototype.getNetTxRow = function(){
  return this.getColumnFromTemp(2)
}

Stream.prototype.getMemRow = function(){
  return this.getColumnFromTemp(3)
}

Stream.prototype.getCPURow = function(){
  return this.getColumnFromTemp(4)
}

Stream.prototype.getColumnFromTemp = function(i){
  let that = this
  return new Promise((resolve, reject) => {
    //to save memory this could be done line by line if plotting acts out...
    fs.readFile(`${that.file_base}`, (err, data) =>{
      if(err){
        log.error(`error while reading temporary file for id ${that.id} ${err}`)
        resolve([])

      } else {
        data = data.toString()
        data = data.split(os.EOL)
        var r = []
        data.forEach((line) => {
          if(line){
            r.push(parseInt(line.split(',')[i]))
          }
        })
        resolve(r)
      }

    })
  });
}
module.exports =  Stream
