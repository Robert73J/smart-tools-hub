// ================= NAVIGATION =================
function showTool(tool) {
  document.querySelectorAll(".tool").forEach(tool => {
    tool.style.display = "none";
  });
  
  
  document.getElementById(tool).style.display = "block";
}

let receiptLogoData = null;

const logoInput = document.getElementById("receiptLogo");

if (logoInput) {
  logoInput.addEventListener("change", function() {
    const file = this.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        receiptLogoData = e.target.result;
        
        const preview = document.getElementById("receiptLogoPreview");
        if (preview) preview.src = receiptLogoData;
      };
      
      reader.readAsDataURL(file);
    }
  });
}


// ================= HELPERS =================
function generateInvoiceNumber() {
  let year = new Date().getFullYear();
  let random = Math.floor(100 + Math.random() * 900);
  return `INV-${year}-${random}`;
}

function getCurrency() {
  return document.getElementById("currency")?.value || "KES";
}

function getCurrency_1() {
  return document.getElementById("recCurrency")?.value || "KES";
}

function formatMoney(amount) {
  return getCurrency() + " " +
    Number(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}

// SAVE + LOAD BUSINESS NAME
function saveBusinessName() {
  const name = document.getElementById("receiptBusiness").value;
  localStorage.setItem("ktHub_businessName", name);
}

function loadBusinessName() {
  const saved = localStorage.getItem("ktHub_businessName");
  if (saved) {
    document.getElementById("receiptBusiness").value = saved;
  }
}

// AUTO SAVE ON INPUT
document.addEventListener("DOMContentLoaded", () => {
  
  loadBusinessName();
  
  document
    .getElementById("receiptBusiness")
    ?.addEventListener("input", saveBusinessName);
  
  document.getElementById("platformVersion").innerText =
    PLATFORM_VERSION;
  
});

// ================= HELB =================
function calculateHELB() {
  let loan = document.getElementById("loan").value;
  let years = document.getElementById("years").value;
  
  let interest = 0.04;
  let total = loan * (1 + interest * years);
  let monthly = total / (years * 12);
  
  document.getElementById("helbResult").innerText =
    "Monthly Payment: KES " + monthly.toFixed(2);
}

// ================= GRADE =================
function calculateGrade() {
  let marks = document.getElementById("marks").value;
  let grade = "";
  
  if (marks >= 80) grade = "A";
  else if (marks >= 70) grade = "B";
  else if (marks >= 60) grade = "C";
  else if (marks >= 50) grade = "D";
  else grade = "E";
  
  document.getElementById("gradeResult").innerText =
    "Grade: " + grade;
}


function calculateVAT(){

let amount =
parseFloat(
document.getElementById("amount").value
);

let rate =
parseFloat(
document.getElementById("vatCalcRate").value
);

let mode =
document.getElementById("vatMode").value;

if(isNaN(amount)){
alert("Enter amount");
return;
}

let result="";

if(mode==="add"){

let gross=
amount*(1+rate/100);

result=
"Gross Amount: KES "+
gross.toFixed(2);

}

else if(mode==="remove"){

let net=
amount/(1+rate/100);

let vat=
amount-net;

result=
"Net: KES "
+ net.toFixed(2)
+
" | VAT: KES "
+ vat.toFixed(2);

}

else if(mode==="vatonly"){

let vat=
amount*(rate/100);

result=
"VAT Amount: KES "
+ vat.toFixed(2);

}

document.getElementById(
"vatResult"
).innerText=result;

}



// PAYE Calculator
function calculatePAYE() {
  
  let salary = parseFloat(
    document.getElementById("grossSalary").value
  );
  
  if (isNaN(salary)) {
    alert("Enter salary");
    return;
  }
  
  let tax = 0;
  
  if (salary <= 24000) {
    tax = salary * 0.10;
  }
  
  else if (salary <= 32333) {
    tax =
      (24000 * 0.10) +
      ((salary - 24000) * 0.25);
  }
  
  else {
    tax =
      (24000 * 0.10) +
      ((32333 - 24000) * 0.25) +
      ((salary - 32333) * 0.30);
  }
  
  /* Example personal relief */
  let relief = 2400;
  
  let paye = Math.max(tax - relief, 0);
  let net = salary - paye;
  
  document.getElementById(
      "payeResult"
    ).innerHTML =
    `
Estimated PAYE: KES ${paye.toFixed(2)}
<br>
Estimated Net Pay:
KES ${net.toFixed(2)}
`;
  
}


function calculateFromBands(amount, bands) {
  for (let band of bands) {
    if (amount >= band.min && amount <= band.max) {
      return band.fee;
    }
  }
  return 0;
}

const sendTariffs = [
  { min: 1, max: 49, fee: 0 },
  { min: 50, max: 100, fee: 0 },
  { min: 101, max: 500, fee: 7 },
  { min: 501, max: 1000, fee: 13 },
  { min: 1001, max: 1500, fee: 23 },
  { min: 1501, max: 2500, fee: 33 },
  { min: 2501, max: 3500, fee: 53 },
  { min: 3501, max: 5000, fee: 57 },
  { min: 5001, max: 7500, fee: 78 },
  { min: 7501, max: 10000, fee: 90 },
  { min: 10001, max: 15000, fee: 100 },
  { min: 15001, max: 20000, fee: 105 },
  { min: 20001, max: 250000, fee: 108 }
];

const withdrawTariffs = [
  { min: 1, max: 100, fee: 11 },
  { min: 101, max: 2500, fee: 29 },
  { min: 2501, max: 3500, fee: 52 },
  { min: 3501, max: 5000, fee: 69 },
  { min: 5001, max: 7500, fee: 87 },
  { min: 7501, max: 10000, fee: 115 },
  { min: 10001, max: 15000, fee: 167 },
  { min: 15001, max: 20000, fee: 185 },
  { min: 20001, max: 35000, fee: 197 },
  { min: 35001, max: 50000, fee: 278 },
  { min: 50001, max: 250000, fee: 309 }
];


function calculateMpesa() {
  
  let amount = parseFloat(
    document.getElementById("mpesaAmount").value
  );
  
  let mode =
    document.getElementById("mpesaMode").value;
  
  let result = "";
  
  if (isNaN(amount)) {
    alert("Enter amount");
    return;
  }
  
  // SEND MONEY
  if (mode === "send") {
    
    let fee = calculateFromBands(amount, sendTariffs);
    
    result =
      "Send Fee: KES " + fee +
      " | Total Debited: KES " + (amount + fee);
    
  }
  
  // WITHDRAW
  else if (mode === "withdraw") {
    
    let fee = calculateFromBands(amount, withdrawTariffs);
    
    result =
      "Withdrawal Fee: KES " + fee +
      " | Cash Received: KES " + (amount - fee);
    
  }
  
  // RECEIVE X (reverse calc)
  else if (mode === "receive") {
    
    let fee = calculateFromBands(amount, sendTariffs);
    
    result =
      "To receive: KES " + amount +
      " | Sender pays: KES " + (amount + fee);
    
  }
  
  // BUY GOODS
  else if (mode === "buygoods") {
    
    result = "Buy Goods: Customer pays KES 0 (no charge)";
    
  }
  
  // LIMIT CHECK
  else if (mode === "limits") {
    
    result =
      amount > 250000 ?
      "Exceeds single transaction limit" :
      "Within allowed transaction limit";
    
  }
  
  document.getElementById("mpesaResult").innerText = result;
}

// ================= VERSIONS =================

const PLATFORM_VERSION = "v1.6";
const INVOICE_VERSION = "v1.5";

// ================= INVOICE =================

let items = [];
let total = 0;

let currentInvoiceNumber =
  generateInvoiceNumber();


let invoiceLogoData = null;

document.getElementById("logoUpload")
  .addEventListener("change", function() {
    
    const file = this.files[0];
    
    if (file) {
      
      const reader = new FileReader();
      
      reader.onload = function(e) {
        
        invoiceLogoData = e.target.result;
        
        document.getElementById("logoPreview").src =
          invoiceLogoData;
        
      };
      
      reader.readAsDataURL(file);
    }
  });

// ADD ITEM

function generateInvoice(){

  let item =
    document.getElementById("item").value;

  let quantity =
    parseFloat(
      document.getElementById("quantity").value
    );

  let unitPrice =
    parseFloat(
      document.getElementById("unitPrice").value
    );
    
   if (!item || isNaN(quantity) ||isNaN(unitPrice)) {
    alert("Fill all fields");
    return;
  }

  let totalPrice =
    parseFloat(quantity * unitPrice);

total += totalPrice;

  items.push({
    item,
    quantity,
    unitPrice,
    totalPrice,
  });

  renderInvoice();

  document.getElementById("item").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("unitPrice").value = "";
}



// RENDER

function renderInvoice(){

  let list =
    document.getElementById("invoiceList");

  list.innerHTML = "";

  items.forEach((entry,index)=>{

    let li =
      document.createElement("li");

    li.innerText =
      `${index+1}. ${entry.item} - ${entry.quantity} x ${entry.unitPrice} = ${formatMoney(entry.totalPrice)}`;
    list.appendChild(li);
  });

  document.getElementById("total").innerText =
    "Total: " + formatMoney(total);
    
  console.log(document.getElementById("total").innerText);
}



// DELETE

function deleteItem(){

  let index =
    parseInt(
      document.getElementById("deleteIndex").value
    ) - 1;

  if(
    isNaN(index) ||
    index < 0 ||
    index >= items.length
  ){
    alert("Invalid item");
    return;
  }

  total -= items[index].totalPrice;

  items.splice(index,1);

  renderInvoice();
}



// HTML
function buildInvoiceHTML(logoDataURL=null, isPDF=false) {
  let businessName = document.getElementById("businessName").value || "Your Business Name";
  let businessAddress = document.getElementById("businessAddress").value || "";
  let customerName = document.getElementById("customerName").value || "Customer";
  let contactInfo = document.getElementById("contactInfo").value || "-";
  let dueDate = document.getElementById("dueDate").value || "-";
  let vatRate = parseFloat(document.getElementById("vatRate").value) || 0;
  
  let date = formatDate();
  
  let subTotal = 0;
  
  let rows = items.map((entry, index) => {
    subTotal += entry.totalPrice;
    return `
      <tr>
       <td style="text-align:center;">${index + 1}</td>
       <td style="text-align:center;">${entry.item}</td>
       <td style="text-align:center;">${entry.quantity}</td>
       <td style="text-align:right; padding-right:40px; font-variant-numeric: tabular-nums;">${Number(entry.unitPrice).toLocaleString()}</td>
       <td style="text-align:right; padding-right:40px; font-variant-numeric: tabular-nums;">${Number(entry.totalPrice).toLocaleString()}</td>
      </tr>
    `;
  }).join("");
  
  let vatAmount = subTotal * (vatRate / 100);
  let grandTotal = subTotal + vatAmount;
  
  
  
  return `
<div class="invoice-container" style="font-family:Arial,sans-serif;">

<!-- TOP HEADER ROW -->
<div style="
display:flex;
justify-content:space-between;
background:#f5f5f5;
padding:6px 0;
margin-bottom:20px;
align-items:flex-start;
">

  <!-- LEFT -->
  <div style="display:flex; align-items:center; gap:15px; margin:0;">
    <img
      src="${logoDataURL || invoiceLogoData || 'images/default-logo.jpeg'}"
      style="height:60px;width:60px;object-fit:contain;border-radius:6px;"
    >

    <div>
      <h2 style="margin:5px;font-size:20px;">
        ${businessName}
      </h2>

      <p style="margin:5px;font-size:13px;color:#555;">
        ${businessAddress}
      </p>
    </div>
  </div>

  <!-- RIGHT -->
  <div style="text-align:right; margin-right:0;">
    <h1 style="margin:0; font-size:22px;">INVOICE</h1>

    <p style="margin:3px 0;">
      # ${currentInvoiceNumber}
    </p>

    <p style="margin:3px 0;">
      Date: ${date}
    </p>

    <p style="margin:3px 0;">
      Due: ${dueDate}
    </p>
  </div>

</div>


<!-- BILL TO -->
<div style="margin-bottom:20px;">
  <h4 style="margin:0 0 5px 0;color:#444;">
    Bill To
  </h4>

  <p style="margin:2px 0;font-weight:bold;">
    ${customerName}
  </p>

  <p style="margin:2px 0;color:#555;">
    ${contactInfo}
  </p>
</div>


<!-- ITEMS TABLE -->
<table style="
width:100%;
border-collapse:collapse;
margin-top:10px;
font-size:14px;
">

<thead>
<tr style="background:#eaeaea;">
  <th style="border:1px solid #ddd;padding:10px;font-size:13px;">#</th>
  <th style="border:1px solid #ddd;padding:10px;font-size:13px;">Item</th>
  <th style="border:1px solid #ddd;padding:10px;font-size:13px;">Qty</th>

  <th style="
  border:1px solid #ddd;
  padding:10px;
  font-size:13px;
  text-align:center;
  ">
    Unit Price (${getCurrency()})
  </th>

  <th style="
  border:1px solid #ddd;
  padding:10px;
  font-size:13px;
  text-align:center;
  ">
    Total (${getCurrency()})
  </th>

</tr>
</thead>

<tbody>
${rows}
</tbody>

</table>


<!-- TOTALS -->
<div style="
margin-top:25px;
display:flex;
justify-content:flex-end;
">

<table style="
border-collapse:collapse;
min-width:260px;
font-size:14px;
">

<tr>
<td style="padding:6px 10px;">
Subtotal
</td>

<td style="
padding:6px 10px;
text-align:right;
">
${formatMoney(subTotal)}
</td>
</tr>


<tr>
<td style="padding:6px 10px;">
VAT (${vatRate}%)
</td>

<td style="
padding:6px 10px;
text-align:right;
">
${formatMoney(vatAmount)}
</td>
</tr>


<tr>
<td style="
padding:10px;
font-weight:bold;
border-top:2px solid #333;
">
Total
</td>

<td style="
padding:10px;
text-align:right;
font-weight:bold;
border-top:2px solid #333;
">
${formatMoney(grandTotal)}
</td>

</tr>

</table>
</div>


<!-- FOOTER -->
<div class="footer">
  Thank you for your business!<br>
  <span style="font-size:9px;">
    Generated by Kenya Tools Hub • ${INVOICE_VERSION}
  </span>
</div>

</div>
`;
}

function invoiceStyles() {
  return `
@page{
  size:A4;
  margin:0;
}

body{
  margin:0;
  background:#ccc;
  font-family:Arial,sans-serif;
}

.invoice-container{
  width:210mm;
  height:297mm;
  margin:20px auto;
  background:#fff;

  padding:20mm 20mm 15mm 20mm;
  box-sizing:border-box;
  
  display:flex;
  flex-direction:column;
  overflow: hidden;
}

@media print{
  body{
    background:none;
  }

  .invoice-container{
    display:flex;
    flex-direction:column;
    width:210mm;
    height:297mm;
    margin:0;
    padding:20mm 20mm 15mm 20mm;
    box-sizing:border-box;
    overflow:hidden;
    page-break-after:avoid;
  }
}

table{
  width:100%;
  border-collapse:collapse;
  table-layout:fixed;
}

th,td{
  border:1px solid #ddd;
  padding:8px;
}

td{
  word-wrap:break-word;
}

th{
  background:#f5f5f5;
}

.money{
  text-align:right;
  padding-right:12px;
  font-variant-numeric:tabular-nums;
}

.footer{
  margin-top:auto;
  left:20mm;
  right:20mm;
  
  font-size:12px;
  color:#888;

  border-top:1px solid #ddd;
  padding-top:6px;
}

img{
  max-width:100%;
}

*{
  -webkit-print-color-adjust:exact;
  print-color-adjust:exact;
}
`;
}

function handleLogoAndProceed(callback) {
  const file = document.getElementById("logoUpload").files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      callback(e.target.result); // pass logo
    };
    reader.readAsDataURL(file);
  } else {
    callback(null); // no logo
  }
}


function previewInvoice() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  handleLogoAndProceed((logo) => {
    const win = window.open("", "_blank");
    
    win.document.write(`
      <html>
        <head>
          <title>Preview</title>
         <style>
          ${invoiceStyles()}
         </style>
        </head>
        <body>
          ${buildInvoiceHTML(logo)}
        </body>
      </html>
    `);
    
    win.document.close();
  });
}


// PRINT
function printInvoice() {
  if (items.length === 0) {
    alert("Add at least one item");
    return;
  }
  
  handleLogoAndProceed((logo) => {
    const win = window.open("", "_blank");
    
    win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
           ${invoiceStyles()}
          </style>
        </head>
        <body>
          ${buildInvoiceHTML(logo)}
        </body>
      </html>
    `);
    
    win.document.close();
    
    win.onload = () => win.print();
  });
}


// PDF
async function downloadInvoice() {
  
  try {
    
    const wrapper =
      document.createElement("div");
    
    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.width = "794px";
    wrapper.style.background = "#fff";
    
    wrapper.innerHTML =
      buildInvoiceHTML(invoiceLogoData);
    
    document.body.appendChild(wrapper);
    
    const element =
      wrapper.querySelector(".invoice-container");
    
    element.style.width = "794px";
    element.style.minHeight = "1123px";
    element.style.background = "#fff";
    
    await new Promise(resolve =>
      setTimeout(resolve, 200)
    );
    
    const canvas =
      await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      });
    
    const imageData =
      canvas.toDataURL("image/jpeg", 1.0);
    
    const { jsPDF } = window.jspdf;
    
    const doc =
      new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
    
    doc.addImage(
      imageData,
      "JPEG",
      0,
      0,
      210,
      297
    );
    
    doc.save(
      `invoice-${currentInvoiceNumber}.pdf`
    );
    
    document.body.removeChild(wrapper);
    
  } catch (error) {
    
    console.log(error);
    
    alert("PDF generation failed");
  }
}

// IMAGE
async function downloadInvoiceImage(){

  await captureAndDownload({
    html: buildInvoiceHTML(invoiceLogoData),
    selector: ".invoice-container",
    filename:
      `invoice-${currentInvoiceNumber}.png`,
    width:794,
    minHeight:1123
  });
}


// SHARE
async function smartShareInvoice(){

  await smartShare({
    html: buildInvoiceHTML(invoiceLogoData),
    selector: ".invoice-container",
    filename:
      `invoice-${currentInvoiceNumber}.png`,
    width:794,
    minHeight:1123
  });
}


// ================= RECEIPT =================
let backendVAT = null;
let backendTotal = null;
let receiptItems = [];
let receiptTotal = 0;
let receiptStatus = "DRAFT"; // default

function generateReceiptNumber(){
  return `REC-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  }

let currentReceiptNumber =
  generateReceiptNumber();



// ADD RECEIPT ITEM

function addReceiptItem(){
  if (receiptStatus === "FINAL") {
    alert("Receipt already finalized. Cannot edit.");
    return;
  }
  
  let codeInput = document.getElementById("receiptCode").value;

  let code = codeInput ?
    codeInput :
    Math.floor(100000 + Math.random() * 900000);

  let item =
    document.getElementById("receiptItem").value;

  let qty =
    parseFloat(
      document.getElementById("receiptQuantity").value
    );

  let unitPrice =
    parseFloat(
      document.getElementById("receiptUnitPrice").value
    );

  if(
    !item ||
    isNaN(qty) ||
    isNaN(unitPrice)
  ){
    alert("Enter valid details");
    return;
  }

  let amount =
    qty * unitPrice;

  receiptItems.push({
    item,
    code,
    qty,
    unitPrice,
    amount
  });

  receiptTotal += amount;

  renderReceipt();

  document.getElementById("receiptItem").value = "";
  document.getElementById("receiptQuantity").value = "";
  document.getElementById("receiptUnitPrice").value = "";
  document.getElementById("receiptCode").value = "";
}



// RENDER RECEIPT

function renderReceipt(){

  let list =
    document.getElementById("receiptList");

  list.innerHTML = "";

  receiptItems.forEach((entry,index)=>{

    let li =
      document.createElement("li");

    li.innerText =
      `${index+1}. ${entry.item} - ${entry.qty} x ${entry.unitPrice} = ${formatMoney_1(entry.amount)}`;
    list.appendChild(li);
  });

  document.getElementById("receiptTotal").innerText =
    "Total: " +
    formatMoney_1(receiptTotal);
}

async function saveReceiptToBackend(status = "DRAFT") {
  receiptStatus = status;
  
  const safeItems = Array.isArray(receiptItems) ? receiptItems : [];
  
  const data = {
    receiptNo: currentReceiptNumber,
    business: document.getElementById("receiptBusiness").value,
    customer: document.getElementById("receiptCustomer").value,
    
    items: safeItems.map(i => ({
      item: i.item,
      qty: i.qty,
      unitPrice: i.unitPrice
    })),
    
    status
  };
  
  console.log("Sending payload:", data);
  
  const res = await fetch(`${BASE_URL}/receipt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  
  const text = await res.text();
  console.log("RAW RESPONSE:", text);
  
  const result = JSON.parse(text);
  
  if (!res.ok) {
    throw new Error(result.message || "Failed to save receipt");
  }
  
  backendVAT = result.vat;
  backendTotal = result.total;
  
  return result;
}

  function generateQRCode(element, receiptNumber) {
    return new Promise((resolve) => {
      //const qrData = `${window.location.origin}/receipt/${receiptNumber}`;
      const qrData =
  `https://robert73j.github.io/smart-tools-hub/receipt.html?receipt=${encodeURIComponent(currentReceiptNumber)}`;
      const canvas = document.createElement("canvas");
      
      QRCode.toCanvas(canvas, qrData, { width: 120 }, () => {
        element.innerHTML = "";
        element.appendChild(canvas);
        resolve();
      });
    });
  }


async function previewReceipt() {
  
  if (receiptStatus !== "FINAL") {
      try {
        await saveReceiptToBackend("FINAL");
      } catch (err) {
        alert(err.message);
        return;
      }
    }
  
  const win = window.open("", "_blank");
  
  win.document.write(`
  <html>
  <head>
    <title>Receipt Preview</title>
    <link rel="stylesheet" href="styles.css">

    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
  </head>

  <body>
    ${receiptHTML(receiptLogoData)}

    <script>
      window.onload = function() {
        const qrData = "https://robert73j.github.io/smart-tools-hub/receipt.html?receipt=${currentReceiptNumber}";

        const canvas = document.createElement("canvas");

        if (window.QRCode) {
          QRCode.toCanvas(canvas, qrData, { width: 100 });
        }

        const qrContainer = document.getElementById("qrcode");

        if (qrContainer) {
          qrContainer.replaceWith(canvas);
        }
      };
    </script>

  </body>
  </html>
  `);
  
  win.document.close();
}

// PRINT
async function printReceipt() {
  if (receiptStatus !== "FINAL") {
      try {
        await saveReceiptToBackend("FINAL");
      } catch (err) {
        alert(err.message);
        return;
      }
    }
  
  let win = window.open("", "_blank");
  
  win.document.write(`
<html>
<head>
  <title>Print Receipt</title>
  <link rel="stylesheet" href="styles.css">

  <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
</head>

<body>

  ${receiptHTML(receiptLogoData)}

  <script>
    window.onload = function() {
      const qrData = "https://robert73j.github.io/smart-tools-hub/receipt.html?receipt=${currentReceiptNumber}";
      
      const canvas = document.createElement("canvas");

      if (window.QRCode) {
        QRCode.toCanvas(canvas, qrData, { width: 100 });
      }

      const qrContainer = document.getElementById("qrcode");
      
      if (qrContainer) {
        qrContainer.replaceWith(canvas);
      }

      window.print();
    };
  </script>

</body>
</html>
`);
  
  win.document.close();
  
  win.onload = function() {
    
    win.focus();
    
    win.print();
    
  };
   }


// PDF
async function downloadReceipt() {
  if (receiptStatus !== "FINAL") {
      try {
        await saveReceiptToBackend("FINAL");
      } catch (err) {
        alert(err.message);
        return;
      }
    }
  
  try {
    
    let mode =
      document.getElementById("receiptMode").value;
    
    const wrapper =
      document.createElement("div");
    
    wrapper.style.position = "fixed";
    wrapper.style.left = "-100000px";
    wrapper.style.top = "0";
    wrapper.style.background = "#fff";
    
    wrapper.innerHTML =
      receiptHTML(receiptLogoData);
    
    document.body.appendChild(wrapper);
    
    const selector =
      mode === "thermal" ?
      ".thermal-container" :
      ".receipt-container";
    
    const element = wrapper.querySelector(selector);

    // 👇 ADD THIS BLOCK HERE
    const qrContainer = element.querySelector("#qrcode");
    
    if (qrContainer && window.QRCode) {
      await generateQRCode(qrContainer, currentReceiptNumber);
    }
    
    // ===== A4 =====
if (mode !== "thermal") {
  
  element.style.width = "794px";
  element.style.height = "auto";
  element.style.minHeight = "1123px";
}
    
    // ===== THERMAL =====
    else {
      
      element.style.width = "300px";
      element.style.height = "auto";
      
    }
    
    element.style.background = "#fff";
    
    await new Promise(resolve =>
      setTimeout(resolve, 200)
    );
    
    const canvas =
      await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0
      });
    
    const imageData =
      canvas.toDataURL("image/jpeg", 1.0);
    
    const { jsPDF } = window.jspdf;
    
    let doc;
    
    // ===== THERMAL PDF =====
    if (mode === "thermal") {
      
      const pdfWidth = 80;
      
      const pdfHeight =
        canvas.height * pdfWidth / canvas.width;
      
      doc =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [pdfWidth, pdfHeight]
        });
      
      doc.addImage(
        imageData,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );
      
    }
    
    // ===== A4 PDF =====
    else {
      
      doc =
        new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });
      
      doc.addImage(
        imageData,
        "JPEG",
        0,
        0,
        210,
        297
      );
      
    }
    
    doc.save(
      `receipt-${currentReceiptNumber}.pdf`
    );
    
    document.body.removeChild(wrapper);
    
  } catch (error) {
    
    console.log(error);
    
    alert("Receipt PDF generation failed");
  }
  
}


// RECEIPT IMAGE
async function downloadReceiptImage(){
  if (receiptStatus !== "FINAL") {
    try {
      await saveReceiptToBackend("FINAL");
    } catch (err) {
      alert(err.message);
      return;
    }
  }

  let mode =
    document.getElementById("receiptMode").value;

  if(mode === "thermal"){

    await captureAndDownload({
      html: receiptHTML(receiptLogoData),
      selector: ".thermal-container",
      filename:
        `thermal-${currentReceiptNumber}.png`,
      width: 300
    });

    return;
  }

  await captureAndDownload({
    html: receiptHTML(receiptLogoData),
    selector: ".receipt-container",
    filename:
      `receipt-${currentReceiptNumber}.png`,
    width: 794,
    minHeight: 1123
  });
  
  try {
    await saveReceiptToBackend("FINAL");
  } catch (err) {
    alert(err.message);
    return;
  }
}



// SHARE RECEIPT
async function smartShareReceipt(){
  if (receiptStatus !== "FINAL") {
    try {
      await saveReceiptToBackend("FINAL");
    } catch (err) {
      alert(err.message);
      return;
    }
  }

  let mode =
    document.getElementById("receiptMode").value;

  if(mode === "thermal"){

    await smartShare({
      html: receiptHTML(receiptLogoData),
      selector: ".thermal-container",
      filename:
        `thermal-${currentReceiptNumber}.png`,
      width:300
    });

    return;
  }

  await smartShare({
    html: receiptHTML(receiptLogoData),
    selector: ".receipt-container",
    filename:
      `receipt-${currentReceiptNumber}.png`,
    width:794,
    minHeight:1123
  });
  try {
    await saveReceiptToBackend("FINAL");
  } catch (err) {
    alert(err.message);
    return;
  }
}



// ================= REUSABLE =================

async function captureAndDownload(config){

  try{

    const wrapper =
      document.createElement("div");

    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";
    wrapper.style.top = "0";
    wrapper.style.background = "#fff";

    wrapper.innerHTML = config.html;

    document.body.appendChild(wrapper);

    const element =
      wrapper.querySelector(config.selector);
      
    const qrContainer = element.querySelector("#qrcode");

    if (qrContainer && window.QRCode) {
      await generateQRCode(qrContainer, currentReceiptNumber);
    }

    element.style.width =
      config.width + "px";

    if (config.height) {
  
      element.style.height =
        config.height + "px";
      
      element.style.minHeight =
        config.height + "px";
      
      element.style.maxHeight =
        config.height + "px";
      
      element.style.overflow = "hidden";
    }
    await new Promise(r=>
      setTimeout(r,200)
    );

    const canvas =
      await html2canvas(element,{
        scale:2,
        useCORS:true,
        backgroundColor:"#fff"
      });

    const image =
      canvas.toDataURL("image/png");

    const a =
      document.createElement("a");

    a.href = image;
    a.download = config.filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    document.body.removeChild(wrapper);

  }catch(error){

    console.log(error);

    alert("Download failed");
  }
}



// ================= SMART SHARE =================

async function smartShare(config){

  try{

    const wrapper =
      document.createElement("div");

    wrapper.style.position = "fixed";
    wrapper.style.left = "-99999px";

    wrapper.innerHTML = config.html;

    document.body.appendChild(wrapper);

    const element =
      wrapper.querySelector(config.selector);
      
    const qrContainer = element.querySelector("#qrcode");

    if (qrContainer && window.QRCode) {
      await generateQRCode(qrContainer, currentReceiptNumber);
    }

    element.style.width =
      config.width + "px";

    if (config.height) {
  
      element.style.height =
        config.height + "px";
      
      element.style.minHeight =
        config.height + "px";
      
      element.style.maxHeight =
        config.height + "px";
      
      element.style.overflow = "hidden";
    }
    await new Promise(r=>
      setTimeout(r,200)
    );

    const canvas =
      await html2canvas(element,{
        scale:2,
        useCORS:true,
        backgroundColor:"#fff"
      });

    canvas.toBlob(async(blob)=>{

      const file =
        new File(
          [blob],
          config.filename,
          {type:"image/png"}
        );

      // NATIVE SHARE

      if(
        navigator.canShare &&
        navigator.canShare({
          files:[file]
        })
      ){

        await navigator.share({
          files:[file],
          title:"Document",
          text:"Shared via SmartBiz Tools"
        });

      }else{

        // FALLBACK DOWNLOAD

        const url =
          URL.createObjectURL(blob);

        const a =
          document.createElement("a");

        a.href = url;
        a.download = config.filename;

        a.click();

        // OPEN WHATSAPP

        window.open(
          "https://wa.me/?text=Please attach downloaded receipt",
          "_blank"
        );
      }

      document.body.removeChild(wrapper);

    },"image/png");

  }catch(error){

    console.log(error);

    alert("Share failed");
  }
}
