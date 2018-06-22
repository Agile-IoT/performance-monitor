# AGILE Performance Monitor


This component monitors CPU, Netowrk and Processor usage from a set of containers throught the docker API. 

Then it plots the consumption graphs over time using a wrapper of GNUPlot


To execute it, first configure the containers you want to monitor and the location of the images with the plots genearted. Make sure that the folder exists!

```
node src/index.js
```
