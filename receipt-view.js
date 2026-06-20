const params =
new URLSearchParams(window.location.search);

const receiptNo =
params.get("receipt");

if (!receiptNo) {
    document.getElementById("receipt").innerHTML =
        "<h2>No receipt number provided.</h2>";
} else {
    loadReceipt();
}

function renderReceipt(receipt) {
    document.getElementById("receipt").innerHTML =
        receiptHTMLFromServer(receipt);
}

async function loadReceipt() {

    try {
        const res = await fetch(
            `${BASE_URL}/receipt/${encodeURIComponent(receiptNo)}`
        );

        if (!res.ok) {

            document.getElementById("receipt").innerHTML =
                "<h2>Receipt not found</h2>";

            return;
        }

        const receipt = await res.json();

        renderReceipt(receipt);

    }

    catch (err) {

        console.error(err);

        document.getElementById("receipt").innerHTML =
            "<h2>Error loading receipt</h2>";

    }

}
