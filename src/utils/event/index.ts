export type EventListener = (val: any) => any;

export interface EventListenerBox {
  key: number;
  listener: EventListener;
  once?: boolean;
}

export class SimpleEventHandler {
  /**
   * 监听器对象
   * @private
   */
  private _listeners: Map<string, Array<EventListenerBox>> = new Map();
  /**
   * 监听器对象唯一索引值
   * @private
   */
  private _lisKey = 0;

  /**
   * 获取监听器数量
   */
  get length() {
    return this._listeners.size;
  }

  /**
   * 添加事件
   * @param name 事件名称
   * @param listener 事件处理器
   * @param once 是否是一次性的
   * @return 事件处理器添加完成后的唯一key值，可用它销毁事件监听
   */
  $on(name: string, listener: EventListener, once = false): number {
    if (!this._listeners.has(name)) {
      this._listeners.set(name, []);
    }
    this._listeners.get(name).push({
      listener,
      key: this._lisKey,
      once,
    })
    return this._lisKey++;
  }

  /**
   * 添加一次性事件
   * @param name 事件名称
   * @param listener 事件处理器
   * @return 事件处理器添加完成后的唯一key值，可用它销毁事件监听
   */
  $once(name: string, listener: EventListener): number {
    return this.$on(name, listener, true);
  }

  /**
   * 删除事件
   * @param name 事件名
   * @param listener 销毁的条件，为空销毁该事件名下的所有事件，可以是添加事件时传入的事件处理器或者添加完成后返回的唯一key值
   */
  $off(name: string, listener?: number | EventListener) {
    // 如果没有传入条件，直接全部删掉
    if (!listener) {
      this._listeners.delete(name);
    }
    // 有条件，且监听器盒子中有这个事件
    else if (this._listeners.has(name)) {
      // 根据对应key的类型拿到需要销毁的索引
      const key = typeof listener === "number" ? 'key' : 'listener';
      const listeners = this._listeners.get(name);
      const index = listeners.findIndex(item => item[key] === listener);
      // 如果被查到的这个就是最后一条，直接删除
      if (index >= 0 && listeners.length === 1) {
        this._listeners.delete(name);
      }
      // 不然就只删这一条
      else {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 发送事件
   * @param name 事件名称
   * @param value 事件数据
   * @param callback 回调
   */
  $emit(name: string, value?: any, callback?: () => void): void {
    if (this._listeners.has(name)) {
      for (const lisBox of this._listeners.get(name)) {
        try {
          lisBox.listener(value);
        } catch (e) {
          console.error(e);
        }
        if (lisBox.once) {
          this.$off(name, lisBox.key);
        }
      }
    }
    callback && callback();
  }
}