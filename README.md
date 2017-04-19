## angular-tabset

#### 示例
```xml
<ourpalm-tabset tabset="vm.tabset" vertical="'bottom'" on-add="" on-close="" on-select="" on-unselect="">
    <ourpalm-tab header="首页">
        首页内容
    </ourpalm-tab>
    <ourpalm-tab header="第二页标题" disabled="true | false" lazy="true | false" selected="true | false">
        第二页内容
    </ourpalm-tab>
    <ourpalm-tab header="第三页标题" disabled="true | false" lazy="true | false">
        第三页内容
    </ourpalm-tab>
</ourpalm-tabset>
```

```js
.controller('DemoController', function (OurpalmTabset) {
    var vm = this;

    //所有配置项
    vm.tabset = new OurpalmTabset({
        vertical: 'top', //标签选项卡位置 'top' ,'bottom', 'left', 'right'
        onSelect: function(tab){
        },
        onUnselect: function(tab){
        },
        onAdd: function(tab){
        },
        onClose: function(tab){
        }
    });

    //方法调用示例
    vm.tabset.addTab({
        header: '动态tab页',
        body: '<dynamic-tabs></dynamic-tabs>', //这里用指令或者组件代替静态html以产生动态效果
        disabled: false,
        lazy: true,
        selected: true,
        closable: true
    });

    vm.tabset.insertTab(2, {
        header: '动态tab页',
        body: '<h1>hello ourpalm tabs</h1>', //这里是静态html代码，不具有交互作用。如果需要交互作用，请使用指令或者组件
        disabled: false,
        lazy: true,
        selected: true,
        closable: true
    });

    vm.tabset.selectTab(2);
});
```




#### tabset属性

|	属性名				  |	 属性值类型 		  | 	   默认值 	   |		描述 					|
|-------------------------|-------------------|--------------------|-----------------------------|
|	vertical        	  |     string    	  |		top 		   |	标签选项卡位置 'top' ,'bottom', 'left', 'right'			|



#### tab属性

|	属性名				  |	 属性值类型 		  | 	   默认值 	   |		描述 					|
|-------------------------|-------------------|--------------------|-----------------------------|
|	header     		 	  |     string   	  |		''			   |	tab标签头					   |
|	body		    	  |     string   	  |		''			   |	tab标签体		      	  |
|	lazy	     		  |     boolean   	  |		false	   	   |	是否延迟初始化				 |
|	disabled     		  |     boolean   	  |		false	   	   |	是否禁用				 |
|	tabId	     		  |     string   	  |		插入的顺序   	   |	tab页在tabset的唯一标示			 |
|	closable    		  |     boolean   	  |		false   	   |	tab页是否可以关闭,默认不可以关闭			 |
|	selected    		  |     boolean   	  |		false   	   |	是否选中tab页			 |


#### tabset事件

|	事件名				  |	 参数    		  | 	  		描述 					|
|-------------------------|-------------------|-----------------------------------------|
|	onSelect     		  |     tab对象   	  |		tab页被选中时触发					   |
|	onUnselect		      |     tab对象   	  |		tab页取消选中时触发     	  |
|	onClose 		      |     tab对象   	  |		tab页关闭时触发     	  |
|	onAdd    		      |     tab对象   	  |		tab页添加时触发     	  |


#### tabset方法

|	方法名				  |	 参数 		      | 	            	描述 					|
|-------------------------|-------------------|-------------------------------------------------|
|	addTab                |   tab             |		 添加tab页			   |
|	insertTab             |   tab, position   |		 插入tab页在position位置				   |
|	closeTab              |   tabId           |		 根据tabId关闭tab页				   |
|	disabledTab           |   tabId           |		 根据tabId禁用tab页				   |
|	enabledTab            |   tabId           |		 根据tabId启用tab页				   |
|	selectTab             |   tabId           |		 根据tabId选中tab页  |
|	exists                |   tabId           |		 根据tabId判断tab页是否存在  |
|	getTab                |   tabId           |		 根据tabId获取tab页配置信息  |
|	getTabs               |                   |		 获取所有tab页信息  |
|	getOptions            |                   |		 获取tabset配置信息  |

#### 在线例子
[在线例子](http://sandbox.runjs.cn/show/easpgkch)