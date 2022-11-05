<template>
  <div class="simple-map-container">
    <div class="map-control" ref="control"></div>
    <div class="search-container" v-if="search">
      <input type="text" class="search-input" v-model="searchVal" placeholder="请输入搜索地址" @input="onInput">
      <div class="search-result-board"></div>
    </div>
    <!-- <div class="map-panel" ref="panel" v-else></div> -->
  </div>
</template>

<script type="text/ecmascript-6">
import { defineComponent } from 'vue';

// 0 未加载，1 加载中，2已加载
let loadStatus = 0;

export default defineComponent({
  emits: ["load"],
  props: {
    ak: {
      type: String,
      default: "",
    },
    secret: {
      type: String,
      default: "",
    },
    search: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      myMap: null,
      searchVal: "",
      timer: -1,
      geolocation: null,
    }
  },
  methods: {
    appendMapUI() {
      const srciptTag2 = document.createElement("script");
      srciptTag2.type = 'text/javascript';
      srciptTag2.src = "https://webapi.amap.com/ui/1.1/main.js";
      srciptTag2.onload = () => {
        window.AMapUI.loadUI(['misc/PositionPicker'], this.onLoadPositionPicker);
      }
      document.body.appendChild(srciptTag2);
    },
    appendBMap() {
      window._AMapSecurityConfig = { securityJsCode: this.secret }
      loadStatus = 1;
      const scriptTag = document.createElement("script");
      scriptTag.type = 'text/javascript';
      // scriptTag.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${this.ak}`;
      scriptTag.src = `https://webapi.amap.com/maps?v=2.0&key=${this.ak}&callback=LoadMapCallback`;

      window.LoadMapCallback = () => {
        window.LoadMapCallback = undefined;
        loadStatus = 2;
        window.postMessage({ type: "SIMPLE_MAP_LOAD" });
        this.appendMapUI();
        this.onMapLoad();
      }
      scriptTag.onerror = () => {
        loadStatus = 0;
      }
      document.body.appendChild(scriptTag);
    },
    /**
     * 异步加载完成，初始化地图
     */
    async onMapLoad() {
      await this.$nextTick();
      const map = new window.AMap.Map(this.$refs.control, {
        resizeEnable: true,
        zoom: 13, //地图显示的缩放级别
      });
      // 同时引入工具条插件，比例尺插件和鹰眼插件
      window.AMap.plugin([
        'AMap.Geolocation',
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.Geocoder',
        "AMap.Driving",
      ], () => {
        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        this.geolocation = new window.AMap.Geolocation()
        map.addControl(this.geolocation);

        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new window.AMap.ToolBar({ position: "RB", offset: [15, 60,] }));

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new window.AMap.Scale());

        this.myMap = map;
        this.$emit("load", this.myMap);
      });
    },
    getSelfLocation() {
      return new Promise((resolve, reject) => {
        this.geolocation.getCurrentPosition((status, result) => {
          if (status !== "complete") return reject({ message: "定位失败" });
          resolve([result.position.lng, result.position.lat])
        })
      })
    },
    getLocation(target) {
      return new Promise((resolve, reject) => {
        const geocoder = new window.AMap.Geocoder({
          // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
          city: target.city,
        })
        geocoder.getLocation(target.keyword, (status, result) => {
          // console.log(status, result)
          if (status !== "complete" || result.geocodes.length === 0) return reject({ message: "未找到目标地址" });
          resolve([result.geocodes[0].location.lng, result.geocodes[0].location.lat])
        })
      })
    },
    /**
     * 
     */
    setRoutePlanByName(target) {
      return new Promise((resolve, reject) => {
        if (!this.myMap) return reject({ message: "尚未初始化完成" });
        const driving = new window.AMap.Driving({
          map: this.myMap,
          // panel: this.$refs.panel,
        })

        this.getSelfLocation().then(local => {
          this.getLocation(target).then(tarLocal => {
            const text = new window.AMap.Text({
              position: tarLocal,
              anchor: 'bottom-center',
              text: target.keyword,
              style: { 'background-color': '#ffffff', color: "#333333", fontSize: "14px", padding: "2px 6px", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowarp" },
              offset: [0, -35]
            });
            this.myMap.add(text);
            driving.search(local, tarLocal, (status, result) => {
              // console.log(status, result)
              if (status !== "complete") return reject({ message: "路线规划失败" })
              resolve(result);
            })
          }).catch(reject)
        }).catch(reject)
      })
    },
    onInput() {
      this.tiemr = setTimeout(this.onSearch, 300)
    },
    onSearch() {
      console.log("search", this.searchVal);
    },
    onLoadPositionPicker(PositionPicker) {
      if (!this.search) return;
      const positionPicker = new PositionPicker({
        mode: 'dragMarker',//拖拽Marker模式
        map: this.myMap,
        iconStyle: { // 自定义外观
          url: 'https://webapi.amap.com/ui/1.0/assets/position-picker2.png',//图片地址
          size: [48, 48],  //要显示的点大小，将缩放图片
          ancher: [24, 40],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
        }
      });
      positionPicker.start();
    }
  },
  created() {
    if (loadStatus === 0) {
      this.appendBMap();
    } else if (loadStatus === 1) {
      const ml = (event) => {
        if (!event.data || event.data.type !== "SIMPLE_MAP_LOAD") return;
        this.onMapLoad();
        window.removeEventListener("message", ml)
      };
      window.addEventListener("message", ml)
    } else {
      this.onMapLoad();
    }
  },
  unmounted() {
    if (this.myMap) {
      this.myMap.destroy();
    }
  },
})
</script>

<style scoped lang="less">
.simple-map-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .map-control {
    width: 100%;
    flex: 1;
  }

  .map-panel {
    width: 100%;
    height: 300px;
    overflow: auto;
  }

  .search-container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    padding: 10px 15px;

    .search-input {
      width: 100%;
      vertical-align: middle;
      background-color: #ffffff;
      line-height: 2;
      font-size: 14px;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      padding: 0.4em 0.8em;
    }

    .search-result-board {
      width: 100%;
      margin-top: 10px;
      max-height: 300px;
      overflow: auto;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>