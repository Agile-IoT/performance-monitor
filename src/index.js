var Docker = require('dockerode')
var conf = require('./conf/perf-conf')
var Stats= require('./stats')
var Plot = require('./plot')
var ContainerFilter = require('./filter')
var util = require('./util')
var log = require('winston');

var docker = new Docker(conf.docker)
var plotter = new Plot(conf.plot)
var filter = new ContainerFilter(conf.filter)
log.level = conf.log_level

let stats = {}

docker.listContainers(function (err, containers) {
  if(err){
    log.error(err)
    process.exit()
  } else{
    containers.forEach(function (containerInfo) {
      docker.getContainer(containerInfo.Id).stats( function (err, stream){
        if(filter.containerNameOk(containerInfo.Names[0])){
          log.info(`container allowed by filter ${containerInfo.Names[0]}`)
          stats[containerInfo.Id] = new Stats(containerInfo.Id,  containerInfo.Names, containerInfo.Image, stream)
          stats[containerInfo.Id].listen()
        }
      })
    });
  }

})

process.on('SIGINT', function() {
  log.info('Caught interrupt signal')
  log.debug(`containers: ${JSON.stringify(Object.keys(stats).map( (k) =>{
    let x = {}
    x[k] = stats[k].name
    return x
  }))}`)
  let cpu = []
  let mem = []
  let net_tx = []
  let net_rx = []
  let names = []
  Object.keys(stats).forEach(stream=>{
    stats[stream].close()
    names.push(stats[stream].name)
    cpu.push(stats[stream].getCPURow())
    mem.push(stats[stream].getMemRow())
    net_tx.push(stats[stream].getNetTxRow())
    net_rx.push(stats[stream].getNetRxRow())
  })
  log.info('Stats closed');
  log.info('Starting to plot');
  //actually execute promises to read data by groups to avoid using more memory than strictly required when plotting
  Promise.all(cpu).then((arr)=>{
    let data = util.zipNames(names, arr, 1024*1024)
    return plotter.plot('processor', data, {title:'CPU consumption', xlabel:'seconds', ylabel:'Mtics/sec'})
  }).then(()=>{
    return Promise.all(net_tx)
  }).then((arr)=>{
    let data = util.zipNames(names, arr, 1024*1024)
    return plotter.plot('network_tx', data, {title:'Network use (Tx)', xlabel:'seconds', ylabel:'MBytes'})
  }).then(()=>{
    return Promise.all(net_rx)
  }).then((arr)=>{
    let data = util.zipNames(names, arr, 1024*1024)
    return plotter.plot('network_rx', data, {title:'Network use (Rx)', xlabel:'seconds', ylabel:'MBytes'})
  }).then(()=>{
    return Promise.all(mem)
  }).then((arr)=>{
    let data = util.zipNames(names, arr, 1024*1024)
    return plotter.plot('memory', data, {title:'Memory consumption', xlabel:'seconds', ylabel:'MBytes/sec'})
  }).catch((err)=>{
    log.error(err)
    return Promise.resolve()
  }).then(()=>{
    log.info('plot finished');
    process.exit();
  }).catch((err)=>{
    log.error('plot not finished? '+err);
    process.exit();
  })

});
