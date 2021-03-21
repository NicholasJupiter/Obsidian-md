# 组件间的通讯方式
1.  父子组件通讯
```HTML
// shop-item.component.ts
export class ShopItemComponent {
  // 接收父组件的传值
  @Input() shop:any;
  // emit把事件传出去 show是名称
  @Output() show: EventEmitter<any> = new EventEmitter();
   
  handleClick(){
    // 执行emit发送事件
    this.click.emit('我点击了!');
  }
}


// shop-list.component.html
// 父组件的html页面
// shop父组件进行传值
// show 是名称,子组件emit触发该方法 $event是组件传回来的值
<app-shop-item [shop]="shop" (show)="handleShow($event)">
</app-shop-item>

// shop-list-component.ts
export class ShopListComponent{
  // 传去子组件的参数
  shop:any;
  // 处理事件
  handleShow(params:any){
    console.log(params);
  }
}

```
2. 祖先通讯方式