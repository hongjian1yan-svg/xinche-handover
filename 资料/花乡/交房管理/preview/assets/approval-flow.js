/* #AI:design 两端原型共用的演示审批状态；不代表正式账号或接口规则。 */
(function(root){
 function departments(entry){return String(entry.item?.depts||'').split('、').map(x=>x.trim()).filter(Boolean)}
 function submit(entry,dept){
  const names=entry.item?.demoCreated?Object.keys(entry.item.categorySelections||{}):departments(entry);if(!names.includes(dept))return false;
  if(entry.item?.demoCreated){
   if(!entry.approvalFlow)entry.approvalFlow={departments:Object.fromEntries(names.map(name=>[name,'unsubmitted'])),history:[]};
   const flow=entry.approvalFlow;if(!['unsubmitted','rejected'].includes(flow.departments[dept]))return false;
   flow.departments[dept]='pending';entry.approvalRecords=entry.approvalRecords||{};if(entry.approvalRecords[dept])entry.approvalRecords[dept].returned=false;
   entry.stage=Object.values(flow.departments).includes('rejected')?'待我交接':'交接中';return true;
  }
  if(!entry.approvalFlow){if(entry.approvalRecords&&Object.keys(entry.approvalRecords).length)return false;if(entry.stage&&entry.stage!=='待认领'&&entry.stage!=='待我交接')return false;entry.approvalFlow={departments:Object.fromEntries(names.map(name=>[name,'pending'])),history:[]}}
  else {if(entry.stage!=='待我交接'||entry.approvalFlow.departments[dept]!=='rejected')return false;entry.approvalFlow.departments[dept]='pending'}
  entry.approvalRecords=entry.approvalRecords||{};if(entry.approvalRecords[dept])entry.approvalRecords[dept].returned=false;
  entry.stage='交接中';return true;
 }
 function status(entry,dept){const f=entry?.approvalFlow,p=f?.departments?.[dept];if(entry?.item?.demoCreated){if(p==='rejected')return '已驳回';if(p==='pending')return '待我审批';if(p==='passed'&&Object.values(f.departments).some(x=>x!=='passed'))return '审批中';return ''}if(p==='rejected')return '已驳回';if(entry?.stage!=='交接中')return '';if(p==='pending')return '待我审批';if(p==='passed'&&Object.values(f.departments).some(x=>x!=='passed'))return '审批中';return ''}
 function decide(entry,dept,choice,reason,time){const f=entry?.approvalFlow;if(status(entry,dept)!=='待我审批'||!['pass','reject'].includes(choice)||(choice==='reject'&&!String(reason||'').trim()))return false;
  f.departments[dept]=choice==='pass'?'passed':'rejected';f.history.push({dept,status:choice==='pass'?'已通过':'已驳回',reason:choice==='reject'?String(reason).trim():undefined,time});
  entry.approvalRecords=entry.approvalRecords||{};entry.approvalRecords[dept]={...(entry.approvalRecords[dept]||{}),returned:choice==='reject',reason:choice==='reject'?String(reason).trim():undefined,time};
  entry.stage=Object.values(f.departments).every(x=>x==='passed')?'待确认':(entry.item?.demoCreated?Object.values(f.departments).includes('rejected'):choice==='reject')?'待我交接':'交接中';return true;
 }
 root.HandoverApproval={submit,status,decide};
})(window);
