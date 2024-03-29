type EventListener = (...val: any[]) => any;


interface WaitEvent {
  value: any[],
}

export interface SimpleEventOnOption {
  /**
   * 是否是一次性的
   */
  once: boolean;
  /**
   * 当监听关闭时
   */
  onOff: () => void;
}

interface EventListenerBox extends Partial<SimpleEventOnOption> {
  key: number;
  listener: EventListener;
}

export class SimpleEventHandler {
  /**
   * 监听器对象
   * @private
   */
  private _listeners: Map<string, Array<EventListenerBox> | WaitEvent> = new Map();
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
   * @param opt 配置项
   * @return 事件处理器添加完成后的唯一key值，可用它销毁事件监听
   */
  $on(name: string, listener: EventListener, opt?: Partial<SimpleEventOnOption>): number {
    let listeners: EventListenerBox[] | WaitEvent;
    // 不存在，添加一个空数组
    if (!this._listeners.has(name)) {
      listeners = [];
      this._listeners.set(name, listeners);
    } else {
      // 存在，从监听器里面取出来
      listeners = this._listeners.get(name);
      // 不是数组，就是等待事件
      if (!Array.isArray(listeners)) {
        // 调用等待时间
        listener(...listeners.value);
        // 如果是仅一次，调用完成后不需要再绑定事件
        if (opt && opt.once) return 0;
        // 不是仅一次，将此次事件继续添加到监听器里面
        listeners = [];
        this._listeners.set(name, listeners);
      }
    }
    // 添加一个监听器盒子
    listeners.push({
      listener,
      key: this._lisKey,
      ...opt,
    })
    // 返回唯一key值
    return this._lisKey++;
  }

  /**
   * 添加一次性事件
   * @param name 事件名称
   * @param listener 事件处理器
   * @return 事件处理器添加完成后的唯一key值，可用它销毁事件监听
   */
  $once(name: string, listener: EventListener): number {
    return this.$on(name, listener, {once: true});
  }

  /**
   * 删除事件
   * @param name 事件名
   * @param listener 销毁的条件，为空销毁该事件名下的所有事件，可以是添加事件时传入的事件处理器或者添加完成后返回的唯一key值
   */
  $off(name: string, listener?: number | EventListener) {
    // 如果没有传入条件，直接全部删掉
    if (!listener) {
      const listeners = this._listeners.get(name);
      // 数组，遍历执行销毁程序
      if (Array.isArray(listeners)) for (const item of listeners) item.onOff();
      // 销毁
      return this._listeners.delete(name);
    }
    // 但是监听器盒子中没有这个事件
    if (!this._listeners.has(name)) return false;
    // 根据对应key的类型拿到需要销毁的索引
    const key = typeof listener === "number" ? 'key' : 'listener';
    // 拿到监听器盒子们
    const listeners = this._listeners.get(name);
    // 不是数组，等待事件直接删掉
    if (!Array.isArray(listeners)) return this._listeners.delete(name);
    // 数组，删掉对应的监听器
    const index = listeners.findIndex(item => item[key] === listener);
    // 没有找到，返回false
    if (index === -1) return false;
    listeners[index].onOff();
    // 如果是最后一条，直接删除
    if (listeners.length === 1) return this._listeners.delete(name)
    // 不然就只删这一条
    listeners.splice(index, 1)
    return true;
  }

  /**
   * 发送事件
   * @param name 事件名称
   * @param value 事件数据
   */
  $emit(name: string, ...value: any[]): void {
    if (this._listeners.has(name)) {
      const listeners = this._listeners.get(name);
      if (!Array.isArray(listeners)) throw new Error("此事件为等待事件，无法通过[emit]触发");
      for (const lisBox of listeners) {
        try {
          lisBox.listener(...value)
        } catch (e) {
          console.error(e)
        }
        if (lisBox.once) this.$off(name, lisBox.key);
      }
    }
  }

  /**
   * 等到对应事件绑定时直接触发绑定的监听器，只触发一次，
   * 建议使用[once]方法，如果使用[on]方法，需要手动调用[off]方法销毁事件监听
   * @param name 事件名称
   * @param value 事件参数
   */
  $wait(name: string, ...value: any[]): void {
    if (this._listeners.has(name)) {
      const listeners = this._listeners.get(name);
      if (Array.isArray(listeners)) throw new Error("此事件已被监听器占用，无法使用[wait]");
      listeners.value = value;
    } else {
      this._listeners.set(name, {value: value});
    }
  }
}
