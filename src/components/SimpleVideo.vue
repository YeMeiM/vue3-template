<template>
  <div class="simple-video" :class="{ 'simple-video-full-screen': isFullScreen, 'hide-mouse': hideMouse }" ref="elRef"
       @mousemove="onMouseMove" >
    <video ref="videoRef" class="simple-video-control" :src="src" :poster="poster"
           :autoplay="autoplay" :loop="loop" @loadedmetadata="onLoadedMetaData"
           @play="isPlay = true" @pause="isPlay = false" @timeupdate="onTimeUpdate">
      您的浏览器不支持 video 标签。
    </video>
    <div class="simple-video-cover" @click.stop="onShowMenu" ></div>
    <transition name="van-fade">
      <div class="simple-video-bottom-menu" v-show="showMenu" @click.stop="onShowMenu" >
        <van-icon :name="isPlay ? 'pause' : 'play'" class="simple-video-play-icon" @click="onPlay"/>
        <div class="simple-video-progress">
          <div class="simple-video-progress-text">{{ formatTime(currentTime) }}/{{ formatTime(totalTime) }}</div>
          <div class="simple-video-progress-bar">
            <div class="simple-video-progress-bar-inner" :style="{ width: `${progress}%` }"></div>
          </div>
        </div>
        <svg t="1686988771038" class="simple-video-full-screen-icon" viewBox="0 0 1024 1024" version="1.1"
             @click="onFullScreen"
             xmlns="http://www.w3.org/2000/svg" p-id="1898" width="200" height="200" v-if="isFullScreen">
          <path
              d="M487.348148 238.364444c-9.102222 0-16.402963 4.551111-16.402963 10.05037l0 176.924444L211.342222 165.736296c-6.826667-6.826667-17.92-6.826667-24.746667 0l0 0c-6.826667 6.826667-6.826667 17.92 0 24.746667l259.602963 259.602963L269.274074 450.085926c-5.594074 0-10.05037 7.395556-10.05037 16.402963 0 9.102222 4.551111 16.402963 10.05037 16.402963l224.237037 0c1.706667 0 3.318519-0.663704 4.740741-1.896296 1.232593-1.137778 2.465185-2.275556 3.602963-3.602963 1.232593-1.422222 1.896296-3.034074 1.896296-4.740741L503.751111 248.414815C503.751111 242.820741 496.45037 238.364444 487.348148 238.364444z"
              fill="#272536" p-id="1899"></path>
          <path
              d="M856.367407 828.776296 596.764444 569.173333 773.688889 569.173333c5.594074 0 10.05037-7.395556 10.05037-16.402963 0-9.102222-4.551111-16.402963-10.05037-16.402963L549.357037 536.367407c-1.706667 0-3.318519 0.663704-4.740741 1.896296-1.232593 1.137778-2.465185 2.275556-3.602963 3.602963-1.232593 1.422222-1.896296 3.034074-1.896296 4.740741L539.117037 770.844444c0 5.594074 7.395556 10.05037 16.402963 10.05037 9.102222 0 16.402963-4.551111 16.402963-10.05037l0-176.924444 259.602963 259.602963c6.826667 6.826667 17.92 6.826667 24.746667 0C863.194074 846.696296 863.194074 835.602963 856.367407 828.776296z"
              p-id="1900"></path>
        </svg>
        <svg t="1686988717933" class="simple-video-full-screen-icon" viewBox="0 0 1024 1024" version="1.1"
             @click="onFullScreen"
             xmlns="http://www.w3.org/2000/svg" p-id="1743" width="200" height="200" v-else>
          <path
              d="M841.955556 614.779259c-9.102222 0-16.402963 4.551111-16.402963 10.05037l0 176.924444L565.94963 542.151111c-6.826667-6.826667-17.92-6.826667-24.746667 0-6.826667 6.826667-6.826667 17.92 0 24.746667l259.602963 259.602963L623.881481 826.500741c-5.594074 0-10.05037 7.395556-10.05037 16.402963 0 9.102222 4.551111 16.402963 10.05037 16.402963l224.237037 0c1.706667 0 3.318519-0.663704 4.740741-1.896296 1.232593-1.137778 2.465185-2.275556 3.602963-3.602963 1.232593-1.422222 1.896296-3.034074 1.896296-4.740741L858.358519 624.924444C858.358519 619.33037 851.057778 614.779259 841.955556 614.779259z"
              fill="#272536" p-id="1744"></path>
          <path
              d="M192.18963 405.428148c9.102222 0 16.402963-4.551111 16.402963-10.05037l0-176.924444 259.602963 259.602963c6.826667 6.826667 17.92 6.826667 24.746667 0 6.826667-6.826667 6.826667-17.92 0-24.746667L233.434074 193.706667l176.924444 0c5.594074 0 10.05037-7.395556 10.05037-16.402963 0-9.102222-4.551111-16.402963-10.05037-16.402963l-224.237037 0c-1.706667 0-3.318519 0.663704-4.740741 1.896296-1.232593 1.137778-2.465185 2.275556-3.602963 3.602963-1.232593 1.422222-1.896296 3.034074-1.896296 4.740741l0 224.237037C175.786667 400.971852 183.182222 405.428148 192.18963 405.428148z"
              p-id="1745"></path>
        </svg>

      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from "vue";

defineProps({
  /**
   * 视频地址
   */
  src: {
    type: String,
    default: "",
  },
  /**
   * 封面
   */
  poster: {
    type: String,
  },
  /**
   * 是否自动播放
   */
  autoplay: {
    type: Boolean,
    default: false,
  },
  /**
   * 是否循环播放
   */
  loop: {
    type: Boolean,
    default: false,
  }
})

const elRef = ref<HTMLDivElement>(null);
const videoRef = ref<HTMLVideoElement>(null);

const showMenu = ref(false);

const totalTime = ref(0);
const currentTime = ref(0);
const isFullScreen = ref(false);
const isPlay = ref(false);
const hideMouse = ref(false);

const progress = computed(function () {
  return currentTime.value / totalTime.value * 100;
})

function formatTime(time: number) {
  const times = [];
  times.push(Math.floor(time / 60));
  if (times[0] > 60) {
    times.push(Math.floor(times[0] % 60));
    times[0] = Math.floor(times[0] / 60);
  }
  times.push(Math.floor(time % 60));
  return times.map((t) => t.toString().padStart(2, "0")).join(":");
}

function onLoadedMetaData() {
  // console.log("e", e)
  totalTime.value = videoRef.value?.duration || 0;
}

function onFullScreen() {
  if (!elRef.value) return;
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => isFullScreen.value = false);
    return;
  }
  elRef.value.requestFullscreen().then(() => isFullScreen.value = true);
}

function onPlay() {
  if (!videoRef.value) return;
  if (!isPlay.value) videoRef.value.play();
  else videoRef.value.pause();
}

let hideTimer = -1;
function onMouseMove() {
  if(!isFullScreen.value) return;
  hideMouse.value = false;
  if(hideTimer !== -1) window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => hideMouse.value = true, 2000);
}

function onTimeUpdate() {
  currentTime.value = videoRef.value?.currentTime || 0;
}

let showMenuTimer = -1;
function onShowMenu(){
  if(!showMenu.value) showMenu.value = true;
  window.clearTimeout(showMenuTimer);
  showMenuTimer = window.setTimeout(() => showMenu.value = false, 2000);
}
</script>

<style scoped lang="less">
.simple-video {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.simple-video-full-screen {
  background-color: #000000;

  .simple-video-full-screen-icon {
    color: #ffffff;
  }

  .simple-video-progress {
    color: #ffffff;
  }

  &.hide-mouse{
    cursor: none;
  }
}

.simple-video-control {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

.simple-video-cover {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
}

.simple-video-bottom-menu {
  position: absolute;
  width: 100%;
  height: 40PX;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .1);
  display: flex;
  align-items: center;
  padding: 0 12PX;
  z-index: 1;
}

.simple-video-play-icon {
  color: #000000;
  font-size: 18PX;
  margin-right: 5PX;
}

.simple-video-progress {
  flex: 1;
  font-size: 12PX;
  display: flex;
  align-items: center;
  color: #000000;
}

.simple-video-progress-bar {
  flex: 1;
  height: 4PX;
  background-color: rgba(255, 255, 255, .5);
  margin: 0 10PX;
  border-radius: 4PX;
}

.simple-video-progress-bar-inner {
  height: 100%;
  background-color: #66ccff;
  border-radius: 4PX;
  position: relative;
}

.simple-video-full-screen-icon {
  width: 22PX;
  height: 22PX;
  color: #000000;

  path {
    fill: currentColor;
  }
}
</style>
