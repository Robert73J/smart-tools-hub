const params = new URLSearchParams(window.location.search);
const receiptNo = params.get("receipt");

const container = document.getElementById("receipt");

if (!receiptNo) {
  container.innerHTML = "<h2>No receipt number provided.</h2>";
} else {
  loadReceipt();
}

/*
function renderReceipt(receipt) {
  try {
    container.innerHTML = receiptHTMLFromServer(receipt);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<h2>Error rendering receipt</h2>";
  }
}
*/

function renderReceipt(receipt) {
  console.log("RECEIPT DATA:", receipt);
  
  try {
    container.innerHTML = receiptHTMLFromServer(receipt);
  } catch (err) {
    console.error("RENDER ERROR:", err);
    container.innerHTML =
      "<pre>" + err.stack + "</pre>";
  }
}

async function loadReceipt() {
  try {
    container.innerHTML = "<p>Loading receipt...</p>";

    const res = await fetch(
      `${BASE_URL}/receipt/${encodeURIComponent(receiptNo)}`
    );

    const text = await res.text();

    let receipt;

    try {
      receipt = JSON.parse(text);
    } catch {
      console.error("Invalid JSON:", text);
      container.innerHTML = "<h2>Invalid server response</h2>";
      return;
    }

    if (!res.ok) {
      container.innerHTML = "<h2>Receipt not found</h2>";
      return;
    }

    renderReceipt(receipt);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<h2>Error loading receipt</h2>";
  }
}
