---
theme: seriph
background: /nodejs-wallpaper.jpg
class: text-center
highlighter: prism
lineNumbers: true
info: |
  ## Slides for Node.js
  Node.js 相关系列课程
drawings:
  persist: false
download: true
---

# 欢迎来到Node.js的世界

我将介绍Node.js服务器开发的相关知识

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>


---

# Node.js 课程的几个部分

讲的细致深入我也没有那个水平，我大致的介绍一下，方便入门就可以。

* Node.js 基础
* Express 教程，中间件，文件上传，错误处理等，官方文档
* REST API以及JWT
* MongoDB 教程
* Docker 项目部署，github项目持续集成       

---
layout: center
class: text-center
---

# 第一章 Node.js 基础   

<div class="bg-lime-500 text-white">

## 七天学会NodeJS [^1]

</div>


[^1]: [7 days nodejs](https://nqdeng.github.io/7-days-nodejs/#1.1)


---
layout: two-cols
---

# 1.1 模块化

node.js 默认为 CommonJS 模块化规范：
* 一个JS文件就是一个模块
* module.exports 暴露模块内的变量、函数、类
* require 引入其他模块内的变量、函数、类


::right::

```js
// 导入模块
var foo1 = require('./foo');
var foo2 = require('./foo.js');
var foo3 = require('/home/user/foo');
var foo4 = require('/home/user/foo.js');
// 加载JSON数据
var data = require('./data.json');


// 导出模块
module.exports = function () {
    console.log('Hello World!');
};

// exports 为指向 module.exports 的引用
exports.hello = function () {
    console.log('Hello World!');
};
```


---

# 1.2 文件操作

文件操作是后端的关键，处理图片、生成excel、读取文本内容等操作都是常见的使用场景。 

Node.js 文件读写相关的模块如下：
* [Buffer](http://nodejs.org/api/buffer.html)（数据块） 处理二进制数据
* [Stream](http://nodejs.org/api/stream.html)（数据流）边读边写如大文件上传处理时使用
* [File System](http://nodejs.org/api/fs.html)（文件系统）文件读写的API
* [Path](http://nodejs.org/api/path.html)（路径）系统文件路径相关的操作 

大概说明一下 stream, fs, path 相关的API

---
layout: two-cols
---

# 1.2.1 Stream

Stream基于事件机制工作，所有Stream的实例都继承于NodeJS提供的 [EventEmitter](https://nodejs.org/api/events.html)。

大文件拷贝示例：
```js
// 创建读取文件的流
var rs = fs.createReadStream(pathname);

// 每次读取数据时触发
rs.on('data', chunk => doSomething(chunk));

// 读取完毕
rs.on('end', () => cleanUp());
```

读取流与写入流
```js
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);

rs.on('data', chunk => ws.write(chunk));

rs.on('end', () => ws.end());
```


::right::

EventEmitter 是典型的发布订阅模式：

```js
// event.js
const { EventEmitter } = require('event');
var emitter = new EventEmitter;
emitter.on('someEvent', function(arg1, arg2) { 
    console.log('第一个监听人员', arg1, arg2); 
}); 
emitter.on('someEvent', function(arg1, arg2) { 
    console.log('第二个监听人员', arg1, arg2); 
}); 
emitter.emit('someEvent', 'arg1 参数', 'arg2 参数'); 
```

输出结果：
```shell
$ node event.js 
第一个监听人员 arg1 参数 arg2 参数
第二个监听人员 arg1 参数 arg2 参数
```


---
layout: two-cols
---

# 1.2.2 File System


文件读写相关API:

- `fs.stat` 返回文件的信息
- `fs.readFile`, `fs.readFileSync` 读取文件
- `fs.writeFile`, `fs.writeFileSync` 写入内容到文件
- `fs.readdir`, `fs.readdirSync` 获取目录的内容
- `fs.unlink`, `fs.unlinkSync` 删除文件
- `fs.mkdir`, `fs.mkdirSync` 新建文件夹
- `fs.createReadStream`, `fs.createWriteStream` 创建可读、可写流

基本上文件读写的API有三种风格，回调函数、同步模式、Promise模式。  

::right::

```js
// 读取文件，回调风格
fs.readFile(pathname, function (err, data) {
    if (err) {
        // Deal with error.
    } else {
        // Deal with data.
    }
});

// 同步模式
try {
    var data = fs.readFileSync(pathname);
    // Deal with data.
} catch (err) {
    // Deal with error.
}

// promise模式
const fsPromises = require('fs/promises');
(async () => {
  var data = await fsPromises.readFile(fileName);
})();
```


---
layout: two-cols
---

# 1.3 HTTP 网络操作

Node.js 的HTTP模块提供了创建HTTP服务器的功能，Express 和 Koa 都是基于这个模块创建的。
这个属于蛮底层的API，大概了解一下就可以。 

'http'模块提供两种使用方式：
* 作为服务端使用时，创建一个HTTP服务器，监听HTTP客户端请求并返回响应。
* 作为客户端使用时，发起一个HTTP客户端请求，获取服务端响应。

::right::
```js
// 服务端，将请求的信息输出返回
http.createServer(function (request, response) {
    response.writeHead(200, { 
      'Content-Type': 'text/plain' 
    });
    request.on('data', chunk => response.write(chunk));
    request.on('end', () => response.end());
}).listen(8484);

// 客户端
var options = {
  hostname: '127.0.0.1',
  port: 8484,
  path: '/upload',
  method: 'POST',
  headers: {
      'Content-Type': 
        'application/x-www-form-urlencoded'
  }
};

var request = http.request(options, response => {});
request.write('Hello World');
request.end();
```

---
layout: image-right
image: /yargs.png
---

# 1.4 Yargs以及作业

使用 [yargs](https://github.com/yargs/yargs)[^1] 来构建命令行工具。 

```js
const yargs = require('yargs/yargs');
const argv = yargs(process.argv.slice(2))
  .option('quanlity', {
    alias: 'q',
    describe: '图片压缩的百分比',
    type: 'number',
  }).argv;
const quanlity = argv.quanlity;
console.log("要压缩的质量为：", quanlity);
```

输出示例：
```shell
$ node tests/yargs-test.js --quanlity 10
要压缩的质量为： 10
```

需要根据这个命令行工具来完成两个作业

[^1]: [Build a Node.js CLI using yargs](https://dev.to/yvonnickfrin/build-a-node-js-cli-using-yargs-2hd)

---
layout: two-cols
---

# 统计目录大小

利用命令行工具库开发一个统计目录大小的程序，并且要能计算一级目录及文件的大小。

输出示例如下：
```shell
$ node fetch-dir-size.js
├── [4.0K]  docs
├── [ 36K]  node_modules
├── [ 406]  package.json
├── [557K]  package-lock.json
└── [458K]  yarn.lock
```


::right::

# 压缩图片

找一个图片压缩的库，实现对图片的压缩处理。
传入压缩的等级0-100，减少的图片的大小。

```shell
$ compress-image -quanlity 50% xxxx.jpg
............
............
............
```