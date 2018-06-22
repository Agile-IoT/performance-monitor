var Filter = function (filter){
  Object.assign(this, filter)
}

Filter.prototype.containerNameOk = function (name){
  if(!this.containers){
    //no filter
    return true
  }
  if(this.containers && name.substring(1) && this.containers.indexOf(name.substring(1))>=0){
    //filter and allowed
    return true
  }
  //filter and disallowed
  else return false
}

module.exports = Filter
