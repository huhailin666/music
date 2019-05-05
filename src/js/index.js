console.log('华为音乐')
import "./icons.js"

const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

class Player {
    constructor(node) {
        this.root = typeof node === 'string' ? document.querySelector(node) : node
        this.$ = selector => this.root.querySelector(selector)
        this.$$ = selector => this.root.querySelectorAll(selector)
        this.songList = []
        this.currentIndex = 0
        this.audio = new Audio()
        this.lyricsArr = []
        this.lyricIndex = -1

        this.start()
        this.bind()
    }
    start() {
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.songList = data
                this.loadSong()
            })
    }
    bind() {
        let self=this;
        //暂停播放
        this.$('.btn-play-pause').onclick = function () {
            if(this.classList.contains('playing')){
                self.playSong()
            }else if(this.classList.contains('pause')){
                self.audio.pause()
                this.classList.remove('pause')
                this.classList.add('playing')
                this.querySelector('use').setAttribute('xlink:href', '#icon-play')
                console.log('暂停了')
            }
        }
        //上一曲下一曲
        this.$('.btn-next').onclick=function(){
            self.currentIndex=(self.currentIndex+1)%4;
            console.log('下一曲')
            console.log(self.currentIndex)
            self.loadSong()
            self.playSong()
        }
        this.$('.btn-pre').onclick=function(){
            self.currentIndex=(self.currentIndex+3)%4;
            console.log('上一曲')
            console.log(self.currentIndex)
            self.loadSong()
            self.playSong()
        }
        //点击中间切换歌词
        this.$('.panels').onclick=function(){
            if(this.classList.contains('panel1')){
                this.classList.remove('panel1');
                this.classList.add('panel2');
            } else {
                this.classList.remove('panel2');
                this.classList.add('panel1');
            }

        }

    }
    playSong() {
        this.audio.oncanplaythrough = () => {
            this.audio.play();
            this.setTime()

        } 
        if(this.$('.btn-play-pause').classList.contains('playing')){
            this.$('.btn-play-pause').classList.remove('playing')
            this.$('.btn-play-pause').classList.add('pause')
            this.$('.btn-play-pause use').setAttribute('xlink:href','#icon-pause')
        }
        console.log('播放了')
    }
    loadSong(){
        let songObj = this.songList[this.currentIndex];
        this.audio.src = this.songList[this.currentIndex].url
        this.$('.header h1').innerText = songObj.title
        this.$('.header p').innerText = songObj.author + '-' + songObj.albumn
        this.loadLyrics();
    }
    //加载歌词
    loadLyrics() {
        fetch(this.songList[this.currentIndex].lyric)
        .then(res=>res.json())
        .then(data=>{
            let lyric = data.lrc.lyric;
            lyric.split(/\n/g).forEach(xxx=>{
                let b = xxx.replace(/\[.+\]/g,'')
                if(b===''){
                    return;
                }else{
                    let a = xxx.match(/\d+/g)
                    let ms = a[0]*60000+a[1]*1000+a[2].slice(0,2)*10
                    this.lyricsArr.push([ms,b]);
                }
                
            })
            console.log(this.lyricsArr)
            this.renderLyrics()
        })
    }
    renderLyrics() {
        let fragment = document.createDocumentFragment()
        this.lyricsArr.forEach(xxx=>{
            let p = document.createElement('p')
            p.innerText= xxx[1];
            fragment.appendChild(p)
        })
        this.$('.panel-lyrics .lyrics-contain').appendChild(fragment)
    }
    setTime(){
        let self=this;
        let currentTime=this.audio.currentTime;
        setInterval(function(){
            console.log(self.lyricIndex++);
            console.log(currentTime);
            self.setLineToCenter(self.$$('.panel-lyrics .lyrics-contain p')[self.lyricIndex])
        },1000)
    }


    setLineToCenter(node){
        console.log(node)
        //offsetHeight表示元素自身的高度，offsetTop是距离上方或上层控件的位置
        let translateY = node.offsetTop - this.$('.panel-lyrics').offsetHeight / 2
        translateY = translateY > 0 ? translateY : 0
        console.log(translateY)

        this.$('.panel-lyrics .lyrics-contain').style.transform = `translateY(-${translateY}px)`
        this.$$('.panel-lyrics .lyrics-contain p').forEach(function(e){
            e.classList.remove('current')
        })
        node.classList.add('current');
    }
}

window.p = new Player('#player')
