class eventCenter {
    on(type, handler){
      $(document).on(type, handler)
    }
    fire(type, data){
      $(document).trigger(type, data)
    }
}
var EventCenter = new eventCenter();