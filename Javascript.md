# Javascript
## 基础知识 

### Promise 
1. Promise 状态
	三个状态分别是： `pending`、`fulfilled`和 `rejected`。
    `pending`：待定状态，Promise的初始状态。在此状态下可以设置状态为`fulfilled`或`rejected`状态
    `fulfilled`：解决状态，表示执行成功，Promise被resolve后的状态，状态不可再变更，且有一个私有的值value
```javascript
// 创建一个Promise class 
class MyPromise{
    this.state = 'pending'
}

const myPromise = new MyPromise();
```

## 前端优化
1. 使用`Web Worker`来处理任务
```Javascript
// worker.js start 

onMessage = function(e){
	console.log(e.data,'接收到值啦!');
	postMessage(e.data);
}

// worker.js end
 
// main.js start
const myWorker = new Worker('./worker.js');
// 接收回传消息
myWorker.onmessage = function(e){
	console.log(e.data,'我收到信息啦!');
}
myWorker.terminate();// 终止worker
myWorker.close();// 关闭worker

document.querySelector('input').oninput = function(e){
	myWorker.postMessage(e.value); // 传入input输入的值
}
// main.js end
 

```
2. 使用防抖 节流
## VUE
```javascript

```
# Angular
[[Angular]]