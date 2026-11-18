// #AI:design 刷新时仅重置交房原型的共享演示数据；普通打开继续共享。
(function(){
  const key='huaxiang:20261023:handover:preview:v1';
  try{
    const navigation=performance.getEntriesByType('navigation')[0];
    if(!navigation||navigation.type!=='reload')return;
    const raw=localStorage.getItem(key);
    if(raw!==null){const data=JSON.parse(raw);if(!data||data.version!==1||!data.tasks||typeof data.tasks!=='object'||Array.isArray(data.tasks))return}
    localStorage.setItem(key,JSON.stringify({version:1,tasks:{},resetId:Date.now()+'-'+Math.random()}));
  }catch(e){console.warn('原型演示状态未重置',e)}
})();
