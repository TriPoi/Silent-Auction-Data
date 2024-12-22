const bids = [];

// Add Bid
document.getElementById("bid-form").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const itemCode = document.getElementById("item-code").value;
  const bidderNumber = parseInt(document.getElementById("bidder-number").value);
  const bidAmount = parseFloat(document.getElementById("bid-amount").value);

  bids.unshift({ itemCode, bidderNumber, bidAmount });
  updateTable();
  e.target.reset();
});

// Update Table
function updateTable() {
  const tbody = document.querySelector("#bids-table tbody");
  tbody.innerHTML = "";

  bids.forEach((bid, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${bid.itemCode}</td>
      <td>${bid.bidderNumber}</td>
      <td>${bid.bidAmount.toFixed(2)}</td>
      <td><button onclick="removeBid(${index})">Remove</button></td>
    `;
    tbody.prepend(row);
  });
}

// Remove Bid
function removeBid(index) {
  bids.splice(index, 1);
  updateTable();
}

// Download Chart
document.getElementById("download-chart").addEventListener("click", () => {
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Item Code,Bidder Number,Bid Amount ($)\n"
    + bids.map(bid => `${bid.itemCode},${bid.bidderNumber},${bid.bidAmount.toFixed(2)}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bids_chart.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
});
