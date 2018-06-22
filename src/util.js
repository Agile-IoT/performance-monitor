module.exports.zipNames = function(names, arr, factor){
  factor = factor || 1
  let data = {}
  for(var i = 0; i<names.length; i++){
    let myarray =  arr[i].map((v)=>{
      return v/factor
    })
    data[names[i]] = myarray 
  }
  return data
}
