class Player {
    constructor(node) {
        this.root = typeof node === 'string' ? document.querySelector(node) : node
        this.$ = selector => this.root.querySelector(selector)
        this.$$ = selector => this.root.querySelectorAll(selector)
        this.currentIndex = 0
        this.channelId = "public_tuijian_wangluo";
        this.audio = new Audio()
        this.lyricsArr = []
        this.lyricIndex = -1
        this.audio.autoplay = true;
        this.musicList= [];
        this.list=1;
        this.bind();
    }
    bind(){
        let _this = this;
        EventCenter.on('select-albumn',function(e,channel){
          _this.channelId = channel.channelId
          _this.channelName = channel.channelName
          _this.loadMusic(function(){
            _this.setMusic()
          })
        })
        EventCenter.on('play-song',function(e,xxx){
            _this.song=xxx.song;
            _this.setMusic()
        })

        $('#list').on('click','.icon-delete',function(){
            _this.musicList.splice($(this).parent().index(),1)
            _this.renderList()
            // $('#app').removeClass('active')
            // $('#player').addClass('active');
        })
        //展示音乐列表
        $('.btn-music-list').on('click',function(){
            if(_this.list===0){
                $('#list').fadeIn('slow');
                _this.list++;
            }else {
                $('#list').fadeOut('slow');
                _this.list--;
            }
        })
        $('.btn-play-pause').on('click ',function(){
            if(!_this.song) return;
            if($('.footer .btn-play-pause').hasClass('play')){
                _this.audio.play();
                $('#list .icon-playing').css("display","block")
                $('.footer .btn-play-pause').removeClass('play').addClass('pause')
                $('.footer .btn-play-pause use').attr("href", "#icon-pause")
            }else{
                _this.audio.pause()
                $('.effect ').children().css("animation","none")
            }
        })
        //上一曲下一曲
        $('.btn-next').on('click ',function(){
            console.log('下一曲')
            _this.loadMusic(function(){
                _this.setMusic()
            })
        })
        $('.btn-pre').on('click ',function(){
            _this.loadMusic(function(){
                _this.setMusic()
            })
        })
        //返回主页面
        this.$('.header .return').onclick=()=>{
            _this.root.classList.remove('active')
            document.querySelector('#app').classList.add('active')
        }
        //点击中间切换歌词
        this.$('.panels').onclick=function(){
            $('#player .balls span.current').removeClass('current').siblings().addClass('current')
            if(this.classList.contains('panel1')){
                this.classList.remove('panel1');
                this.classList.add('panel2');
            } else {
                this.classList.remove('panel2');
                this.classList.add('panel1');
            }
        }
        /*音乐播放进度展示 */  /*_this.audio.onplay = function也行 */
        this.audio.ontimeupdate = function() {
            _this.locateLyric()
            _this.setProgerssBar()
        }
        /*音乐播放进度展示 */
        this.audio.addEventListener('pause',function(){
            $('.btn-play-pause').removeClass('pause')
            $('.btn-play-pause').addClass('play')
            $('.btn-play-pause use').attr("href", "#icon-play")
            console.log('暂停了')
            $('#list .icon-playing').css("display","none")
        })
        this.audio.addEventListener('play',function(){
            $('.footer .btn-play-pause').removeClass('play').addClass('pause')
            $('.footer .btn-play-pause use').attr("href", "#icon-pause")
            $('#list .icon-playing').css("display","block")
            $('.effect .effect-1').css("animation","rotate 20s linear infinite ")
            $('.effect .effect-2').css("animation","rotate 10s linear infinite reverse ")
            $('.effect .effect-3').css("animation","rotate 10s linear infinite ")
        })
        /*进度条被点击 */
        $('#player .bar-area .bar').on('click',function(e){
            var a = e.offsetX;
            var b = a / parseInt($('#player .bar-area .bar').width());
            _this.audio.currentTime = b * _this.audio.duration;
        })
    }
    loadMusic(callback){
        let  _this = this;
        $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php?public_tuijian_ktv',{channel: _this.channelId})
        .done(function(ret){
          _this.song = ret.song[0]
          callback()
        })
    }
    /*渲染音乐内容到页面上 */
    setMusic(){
        this.audio.src = this.song.url
        this.$('.header h1').innerText = this.song.title;
        this.$('.header p').innerText = this.song.artist ;
        this.loadLyric();
        this.musicList.unshift(this.song)
        this.renderList();
    }
    /*加载歌词 */
    loadLyric(){
        let  _this = this;
        $.getJSON('https://jirenguapi.applinzi.com/fm/getLyric.php',{sid: _this.song.sid}).done(xxx=>{
            let lyric = xxx.lyric
            let lyricsObj=[];
            if($('.panel-lyrics .lyrics-contain p')){
                $('.panel-lyrics .lyrics-contain p').remove()
            }
            /*lyric.split('\n')让其成为数组 */
            lyric.split(/\n/g).forEach(xxx=>{
                let c = xxx.replace(/\[.+\]/g,'')
                let b = c.replace(/音乐来自百度FM, by 饥人谷/,'')
                if(b===''){
                    return;
                }else{
                    let a = xxx.match(/\d+/g)
                    if(a){
                        let ms = a[0]*60000+a[1]*1000+a[2].slice(0,2)*10
                        lyricsObj.push([ms,b]);
                    }

                }
                    
            })
            this.lyricsArr=lyricsObj;
            this.renderLyrics();
        })
    }
    renderLyrics() {
        this.lyricIndex=-1;

        let fragment = document.createDocumentFragment()
        this.lyricsArr.forEach(xxx=>{
            let p = document.createElement('p')
            p.innerText= xxx[1];
            fragment.appendChild(p)
        })
        this.$('.panel-lyrics .lyrics-contain').appendChild(fragment)
    }

    setProgerssBar() {
        let _this=this;
        let percent = (this.audio.currentTime * 100 /this.audio.duration) + '%'
        let min = Math.floor(_this.audio.currentTime/60)
        let second = Math.floor(_this.audio.currentTime%60) + ''
        second = second.length ===2?second:('0'+second);
        this.root.querySelector('.bar-area .time-start').innerText=min+':'+ second;
        this.$('.bar .progress').style.width = percent
        this.root.querySelector('.bar-area .time-end').innerText=Math.floor(this.audio.duration/60)+':'+Math.floor(this.audio.duration%60);

    }

    setLineToCenter(node){
        //offsetHeight表示元素自身的高度，offsetTop是距离上方或上层控件的位置
        let translateY = node.offsetTop - this.$('.panel-lyrics').offsetHeight / 2
        translateY = translateY > 0 ? translateY : 0
        this.$('.panel-lyrics .lyrics-contain').style.transform = `translateY(-${translateY}px)`
        this.$$('.panel-lyrics .lyrics-contain p').forEach(function(e){
            e.classList.remove('current')
        })
        node.classList.add('current');
    }

    locateLyric() {
        let currentTime = this.audio.currentTime*1000
        let nextLineTime = this.lyricsArr[this.lyricIndex+1][0]
        if(currentTime > nextLineTime && this.lyricIndex < this.lyricsArr.length - 1) {
            this.lyricIndex++
            let node = this.$$('.panel-lyrics .lyrics-contain p')[this.lyricIndex]
            if(node) {
                this.setLineToCenter(node)
            }
            this.$$('.panel-effect .lyric p')[0].innerText = this.lyricsArr[this.lyricIndex][1]
            this.$$('.panel-effect .lyric p')[1].innerText = this.lyricsArr[this.lyricIndex+1] ? this.lyricsArr[this.lyricIndex+1][1] : ''
          
        }
    }
    renderList(){
        $('#list li').remove()
        let first=`<li>
            <svg class="icon-delete" aria-hidden="true">
                <use href="#icon-shanchu"></use>
            </svg> 
            <svg class="icon-playing" aria-hidden="true">
                <use href="#icon-yinlebofangxuanlvjiezou"></use>
            </svg> 
            <h2>1</h2>
            <h5>${this.musicList[0].title}</h5>
            <svg class="sq" aria-hidden="true">
                <use href="#icon-sq"></use>
            </svg>
            <p>${this.musicList[0].artist}</p>
        </li>`
        $('#list').append($(first))
        for(let i=1;i<this.musicList.length;i++){
            if(this.musicList[i].sid===this.musicList[0].sid) {
                this.musicList.splice(i,1)
            }
            let x = this.musicList[i]
            let node =  `<li>
            <svg class="icon-delete" aria-hidden="true">
                <use href="#icon-shanchu"></use>
            </svg> 
            <h2>${i+1}</h2>
            <h5>${x.title}</h5>
            <svg class="sq" aria-hidden="true">
                <use href="#icon-sq"></use>
            </svg>
            <p>${x.artist}</p>
            </li>`
            $('#list').append($(node))
        }
    }
}
window.p = new Player('#player')