# AGILE Performance Monitor


This component monitors CPU, Netowrk and Processor usage from a set of containers throught the docker API. 

Then it plots the consumption graphs over time using a wrapper of GNUPlot


To execute it, first configure the containers you want to monitor and the location of the images with the plots genearted. Make sure that the folder exists!

```
node src/index.js
```


## Connecting to docker sockets


The docker field of the configuration specifies how to interact with Docker APIs. So, if you want to use the local docker deamon you can use the following:

```  
docker:{
    socketPath: '/var/run/docker.sock'
  }
```

If you are running docker remotely (for example after configuring your deamon to listen on 0.0.0.0 https://success.docker.com/article/how-do-i-enable-the-remote-api-for-dockerd) and need to monitor containers executed in another machine you can use something like this.

```

docker:{
    host: 'remotehost.com',
    port: 2376,
    version: 'v1.22'
}
 
```


