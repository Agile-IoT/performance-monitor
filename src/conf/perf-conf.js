module.exports = {
  docker:{
    socketPath: '/var/run/docker.sock'
  }, filter:{
    containers: ['agile-security', 'agile-ui', 'agile-core', 'agile-osjs']
  },
  plot: {
    path: './img/',
    format: 'png'
  },
  log_level: "debug"

}
