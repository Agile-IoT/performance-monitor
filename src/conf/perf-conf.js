module.exports = {
  docker:{
    //socketPath: '/var/run/docker.sock'
    host: 'passaugw.local',
    port: 2376,
    version: 'v1.22'
  }, filter:{
    containers: ['agile-security', 'agile-ui', 'agile-core', 'agile-osjs']
  },
  plot: {
    path: './img/',
    format: 'png'
  },
  log_level: "debug"

}
