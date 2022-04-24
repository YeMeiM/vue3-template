# vue3基础模板

## 快速开始

### 安装

- npm安装
```
npm install
```

- yarn 安装

```
yarn
```

- pnpm 安装

```
pnpm install
```

### 运行与编译

- 开发运行

```
npm run serve
```

- 生产运行

```
npm run serve:pro
```

- 使用开发条件编译

```
npm run build:dev
```

- 使用生产条件编译

```
npm run build
```

### 项目配置项

- 开发环境配置项在[.env.development](.env.development)文件中配置
- 生产环境配置项在[.env](.env)文件中配置
- 生产运行环境会同时使用[.env](.env)和[.env.pro](.env.pro)两个文件的条件，优先后者。
- 其他配置项在 [vue.config.js](vue.config.js)中修改，具体用法查看[Vue-Cli-Config](https://cli.vuejs.org/config/).

### 其他信息说明

- components/Page 组件为页面容器，自带下拉刷新和列表加载。
- utils/func/index.ts 基础工具，自导出变量名为「_uu」，而全局挂载的变量为「$uu」
- utils/setup/loadList.ts 文件为Php列表请求加载的封装。
- utils/common/*.ts 文件为全局通用的工具方法
  - index.ts 为全局属性，为原生js中的对象额外挂载新的属性和方法
  - verifcations.ts 为校验工具，已集成到基础工具中
- utils/directive/index.ts 为自定义指令文件
- utils/event/index.ts 为全局事件管理，已集成到基础工具当中
- utils/request/index.ts 请求工具，可以使用基础工具调用
- plugins/cssVar.ts 全局css变量添加管理，频繁修改影响页面性能