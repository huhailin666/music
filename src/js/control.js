import './player.js'

class control{
  constructor(){
    this.$root1=$('#app .main ');
    this.$root2=$('#app .footer ');
    this.bind()
  }
  bind(){
    let _this=this;
    //点击搜索
    $('.search label').on('click',function(){
      console.log('xxx')
      $('.search span').fadeIn('slow',function(){
        $('.search span').fadeOut('slow')
      })
    })
    //点击播放最近列表音乐
    $('#list').on('click','h5',function(){
      // $('#app').removeClass('active')
      // $('#player').addClass('active');
      console.log($(this).parent().index())
      console.log(p.musicList[$(this).parent().index()])
      EventCenter.fire('play-song',({song:p.musicList[$(this).parent().index()]}))
    })

    //点击音乐分类
    this.$root1.find('.hotList .box').on('click','li',function(){
      $('#app').removeClass('active')
      $('#player').addClass('active');
      EventCenter.fire('select-albumn',({channelId:$(this).attr('data-channel-id'),channelName:$(this).attr('data-channel-name')}))
    })
    //点击返回
    $('.header .icon-you').on('click',function(){
      $('#app').removeClass('active')
      $('#player').addClass('active');
    })
    //点击播放列表上的音乐

    //点击每日精选音乐
    $('.main .dayChoose >ul').on('click','li',function(){
      $('#app').removeClass('active')
      $('#player').addClass('active');
      EventCenter.fire('play-song',({song:app.dayChooseList[$(this).index()]}))
    })
    //点击切换
    $('#app nav ul li').on('click',function(){
      $(this).addClass('active').siblings().removeClass('active')
      $('#app').scrollTop=0;
      let i = $(this).index()
      $('.main .wrap').css("transform","translateX(-"+i*100+"vw)")
    })

    //点击为你推荐
    $('#app nav ul li').eq(1).on('click',function(){
      window.scrollTo(0,0)
    })
    //点击播放为你推荐音乐
    $('.main .recommend >ul').on('click','li',function(){
      $('#app').removeClass('active')
      $('#player').addClass('active');
      console.log($(this).index())
      EventCenter.fire('play-song',({song:app.recommendList[$(this).index()]}))
    })

    //点击加载更多音乐分类
    $('.main .hotList .box').on('click','.add',function(){
      $('.hotList .box li:gt(4)').css("display","block")
      $('.hotList .box .add').css("display","none")
    })
  }


}
new control()


