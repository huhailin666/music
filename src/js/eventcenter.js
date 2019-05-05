EventCenter = {
    on:function(type, handler){
      $(document).on(type, handler)
    },
    fire:function(type, data){
      $(document).trigger(type, data)
    }
}
console.log('加载了eventcenter')
