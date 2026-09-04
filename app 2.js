const pages=["homePage","scanPage","historyPage","summaryPage"];
let stream=null;
let records=JSON.parse(localStorage.getItem("ipadFaceRecords")||"[]");

function go(id){
 pages.forEach(p=>document.getElementById(p).classList.toggle("active",p===id));
 render();
 window.scrollTo({top:0,behavior:"smooth"});
}
async function openCamera(){
 try{
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
  document.getElementById("video").srcObject=stream;
  document.getElementById("cameraHint").style.display="none";
  document.getElementById("scanStatus").textContent="กล้องพร้อมใช้งาน";
  document.getElementById("scanMessage").textContent="กดสแกนเพื่อจำลองการเช็กชื่อ";
 }catch(e){
  document.getElementById("scanStatus").textContent="เปิดกล้องไม่สำเร็จ";
  document.getElementById("scanMessage").textContent="โปรดอนุญาตสิทธิ์กล้อง และเปิดผ่าน HTTPS";
 }
}
function simulateScan(){
 const name=document.getElementById("name").value.trim(), sid=document.getElementById("sid").value.trim(), cls=document.getElementById("class").value;
 if(!name||!sid){alert("กรุณากรอกชื่อและรหัสนักเรียน");return}
 const laser=document.getElementById("laser"), text=document.getElementById("scanText");
 laser.style.display="block";text.textContent="กำลังสแกน...";
 document.getElementById("scanStatus").textContent="กำลังสแกนใบหน้า";
 setTimeout(()=>{
   laser.style.display="none";text.textContent="✓ เช็กชื่อสำเร็จ";
   document.getElementById("scanStatus").textContent="บันทึกการเข้าเรียนแล้ว";
   document.getElementById("scanMessage").textContent="เวลาถูกบันทึกอัตโนมัติ";
   records.unshift({name,sid,cls,time:new Date().toLocaleString("th-TH"),day:new Date().toLocaleDateString("en-CA")});
   localStorage.setItem("ipadFaceRecords",JSON.stringify(records));render();
   setTimeout(()=>text.textContent="",2200);
 },1800);
}
function render(){
 const today=new Date().toLocaleDateString("en-CA");
 document.getElementById("allCount").textContent=records.length;
 document.getElementById("todayCount").textContent=records.filter(r=>r.day===today).length;
 document.getElementById("summaryNumber").textContent=records.length;
 const list=document.getElementById("list");
 list.innerHTML=records.length?records.map(r=>`<tr><td>${safe(r.time)}</td><td>${safe(r.name)}</td><td>${safe(r.sid)}</td><td>${safe(r.cls)}</td><td><span class="ok">✓ มาเรียน</span></td></tr>`).join(""):`<tr><td colspan="5" class="empty">ยังไม่มีรายการเช็กชื่อ</td></tr>`;
}
function safe(v){const d=document.createElement("div");d.textContent=v;return d.innerHTML}
function clearData(){if(confirm("ต้องการล้างข้อมูลทั้งหมดหรือไม่?")){records=[];localStorage.removeItem("ipadFaceRecords");render()}}
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
render();