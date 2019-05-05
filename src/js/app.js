import './icons.js'
import './control.js'

import '../scss/app.scss'
import '../scss/index.scss'

class app{
    constructor(){
        this.$root=$('#app');
        this.dayChooseList=[];
        this.recommendList=[];
        this.channelsList=[];
        this.channelIndex=0;
        this.bind();
        this.start();
    }
    //绑定获取更多音乐事件
    bind(){
        let _this=this;
        $('.dayChoose .addMore').on('click',function(){
            _this.channelIndex++
            if(_this.channelIndex>19){
                _this.channelIndex=0 
            }
            _this.load()
        })
        $('.recommend .addMore').on('click',function(){
            _this.channelIndex++
            _this.recommendMusic()
        })
    }
    //获取音乐分类
    start(){
        let _this = this;
        $.getJSON('https://jirenguapi.applinzi.com/fm/getChannels.php')
        .done(xxx=>{
            _this.renderHotList(xxx)
        }).fail(()=>{
          console.log('error')
        })
    }
    //渲染分类
    renderHotList(ccc){
        let xxx=ccc.channels
        let tpl = '' 
        for(let i = 0 ; i < xxx.length-1;i++){
            tpl +=  '<li class="item" data-channel-id="' + xxx[i].channel_id + '" data-channel-name = "' + xxx[i].name +'">'
            tpl += '  <div class="img" style="background-image:url(' + xxx[i].cover_small + ')"></div>'
            tpl +=  '<h4>'+ xxx[i].name + '</h4>'
            tpl +=  '</li>'
            this.channelsList.push(xxx[i].channel_id)

        }
        this.$root.find('.hotList .box').append($(tpl))
        $('.hotList .box li').eq(5).before('<div class="add" >加载更多</div>')
        $('.hotList .box li:gt(4)').css("display","none")
        this.load();
        this.recommendMusic()
        $('.icon-loading').css("display","none")
        $('.main').css("display","block")
    }
    //加载热歌
    load(){
        let _this=this
        for(let i = 0 ; i <8;i++){
            $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php',{channel: _this.channelsList[_this.channelIndex]})
            .done(xxx=>{
                let x=xxx.song[0]
                _this.dayChooseList.push(x);
                let node =  `<li>
                                <img src= "${x.picture}">
                                <svg class="play"  aria-hidden="true">
                                    <use xlink:href="#icon-play"/>
                                </svg>
                                <h5>${x.title}</h5>
                                <svg class="sq" aria-hidden="true">
                                    <use xlink:href="#icon-sq"></use>
                                </svg>
                                <p>${x.artist}</p>
                            </li>`
                _this.$root.find('.dayChoose ul').append($(node))
            })
        }
    }
    //为你推荐
    recommendMusic(){
        let _this=this
        for(let i = 0 ; i <8;i++){
            $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php',{channel: _this.channelsList[_this.channelIndex+20]})
            .done(xxx=>{
                let x=xxx.song[0]
                _this.recommendList.push(x);
                let node =  `<li>
                                <img src= "${x.picture}">
                                <svg class="play"  aria-hidden="true">
                                    <use xlink:href="#icon-play"/>
                                </svg>
                                <h5>${x.title}</h5>
                                <svg class="sq" aria-hidden="true">
                                    <use xlink:href="#icon-sq"></use>
                                </svg>
                                <p>${x.artist}</p>
                            </li>`
                _this.$root.find('.recommend ul').append($(node))
            })
        }

    }
}
window.app=new app()