const bids = [];

// Add Bid
document.getElementById("bid-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const itemCode = document.getElementById("item-code").value.trim();
  const bidderNumber = parseInt(document.getElementById("bidder-number").value.trim(), 10);
  const bidAmount = parseFloat(document.getElementById("bid-amount").value.trim());

  // Error handling
  if (!itemCode || isNaN(bidderNumber) || isNaN(bidAmount) || bidAmount <= 0) {
    alert("Please provide valid inputs for all fields. Bid amount must be greater than 0.");
    return;
  }

  if (bids.some(bid => bid.itemCode === itemCode && bid.bidderNumber === bidderNumber)) {
    alert("This bidder has already placed a bid for this item. Please update the existing bid or enter a new one.");
    return;
  }

  // Add bid to the top of the list
  bids.unshift({ itemCode, bidderNumber, bidAmount });
  updateTable();

  // Reset form
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
    tbody.appendChild(row);
  });
}

// Remove Bid
function removeBid(index) {
  if (confirm("Are you sure you want to remove this bid?")) {
    bids.splice(index, 1);
    updateTable();
  }
}

// Download Chart with Sorted and Aggregated Data
document.getElementById("download-chart").addEventListener("click", () => {
  if (bids.length === 0) {
    alert("No bids to download!");
    return;
  }

  // Aggregate data by bidder number
  const aggregatedData = {};
  bids.forEach(({ bidderNumber, itemCode, bidAmount }) => {
    if (!aggregatedData[bidderNumber]) {
      aggregatedData[bidderNumber] = { items: [], total: 0 };
    }
    aggregatedData[bidderNumber].items.push(`${itemCode} ($${bidAmount.toFixed(2)})`);
    aggregatedData[bidderNumber].total += bidAmount;
  });

  // Prepare CSV content
  const sortedBidders = Object.keys(aggregatedData).sort((a, b) => a - b);
  const csvContent = "data:text/csv;charset=utf-8,"
    + "Bidder Number,Items Won,Total Amount ($)\n"
    + sortedBidders.map(bidderNumber => {
      const { items, total } = aggregatedData[bidderNumber];
      return `${bidderNumber},"${items.join(", ")}",${total.toFixed(2)}`;
    }).join("\n");

  // Create and trigger CSV download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "bids_summary.csv");
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
});
