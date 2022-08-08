import { App } from "vue";

export function install(app: App) {
  // v-move.auto 添加此指令后，使dom可以拖动
  app.directive("move", {
    mounted(el: HTMLElement, binding) {
      const p = {
        x: 0, // 相对位置x
        y: 0, // 相对位置y
        x1: 0, // 鼠标第一次按下的位置x
        y1: 0, // 鼠标第一次按下的位置y
        x2: 0, // 鼠标按下时与dom的相对位置x
        y2: 0, // 鼠标按下时与dom的相对位置y
      }
      el.addEventListener("touchstart", function (event) {
        p.x1 = event.touches[0].clientX;
        p.y1 = event.touches[0].clientY;
        p.x2 = el.offsetLeft - p.x1;
        p.y2 = el.offsetTop - p.y1;

        // console.log("dragstart", JSON.stringify(p))

        function onDrag(event: TouchEvent) {
          p.x = event.touches[0].clientX - p.x1;
          p.y = event.touches[0].clientY - p.y1;
          // console.log("move", p.x, p.y)
          el.style.transform = `translate(${p.x}px,${p.y}px)`;
        }

        function onDragEnd() {
          // console.log("dragend", JSON.stringify(p))
          const position = Object.assign({
            top: p.y + p.y1 + p.y2,
            left: p.x + p.x1 + p.x2
          }, p);
          Object.keys(p).forEach(k => (p as any)[k] = 0);
          el.style.transform = "";
          window.removeEventListener("touchmove", onDrag)
          window.removeEventListener("touchend", onDragEnd)
          if (binding.modifiers.auto) {
            el.style.left = position.left + "px";
            el.style.top = position.top + "px";
          }
          if (typeof binding.value === "function") {
            binding.value(el, position);
          }
        }

        window.addEventListener("touchmove", onDrag)
        window.addEventListener("touchend", onDragEnd)
      })
    }
  })

  const defaultWaitTime = 2000;
  const getEventListener = (waitTime: number) => {
    let lastClickTime = 0;
    return function (event: any) {
      const now = new Date().getTime();
      if (now - lastClickTime > waitTime) {
        lastClickTime = now;
      } else {
        event.stopImmediatePropagation();
      }
    }
  }

  app.directive("wait-event", {
    mounted(el, binding) {
      console.log(el, binding);
      let waitTime = Number(binding.value);
      if (isNaN(waitTime)) waitTime = defaultWaitTime;
      const keys = Object.keys(binding.modifiers);
      if (keys.length == 0) {
        el.addEventListener("click", getEventListener(waitTime), true);
      } else {
        keys.forEach(key => el.addEventListener(key, getEventListener(waitTime), true));
      }
    }
  })
}