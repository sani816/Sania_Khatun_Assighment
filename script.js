let members = [];
let balances = {};
let expenses = [];

function addMember() {
  let name = document.getElementById("memberName").value;
  if (!name) return;

  members.push(name);
  balances[name] = 0;

  updateMembers();
  document.getElementById("memberName").value = "";
}

function updateMembers() {
  let list = document.getElementById("membersList");
  let paidBy = document.getElementById("paidBy");
  let customDiv = document.getElementById("customInputs");

  list.innerHTML = "";
  paidBy.innerHTML = "";
  customDiv.innerHTML = "";

  members.forEach(m => {
    list.innerHTML += `<li>${m}</li>`;
    paidBy.innerHTML += `<option>${m}</option>`;

    customDiv.innerHTML += `
      <input type="number" placeholder="${m} amount" id="custom-${m}">
    `;
  });
}

function addExpense() {
  let desc = document.getElementById("desc").value;
  let amount = parseFloat(document.getElementById("amount").value);
  let payer = document.getElementById("paidBy").value;
  let type = document.getElementById("splitType").value;

  if (!amount || members.length === 0) return;

  if (type === "equal") {
    let split = amount / members.length;

    members.forEach(m => {
      if (m === payer) balances[m] += amount - split;
      else balances[m] -= split;
    });

  } else {
    members.forEach(m => {
      let val = parseFloat(document.getElementById(`custom-${m}`).value) || 0;

      if (m === payer) balances[m] += amount - val;
      else balances[m] -= val;
    });
  }

  updateBalances();
  calculateSettlement();
}

function updateBalances() {
  let list = document.getElementById("balances");
  list.innerHTML = "";

  for (let p in balances) {
    let val = balances[p];
    let li = document.createElement("li");

    if (val > 0) {
      li.innerText = `${p} gets ₹${val.toFixed(2)}`;
      li.classList.add("positive");
    } 
    else if (val < 0) {
      li.innerText = `${p} owes ₹${Math.abs(val).toFixed(2)}`;
      li.classList.add("negative");
    } 
    else {
      li.innerText = `${p} settled`;
    }

    list.appendChild(li);
  }
}
function toggleCustom() {
  let type = document.getElementById("splitType").value;
  let div = document.getElementById("customInputs");

  if (type === "custom") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}
function calculateSettlement() {
  let creditors = [];
  let debtors = [];

  for (let p in balances) {
    if (balances[p] > 0) creditors.push({name: p, amt: balances[p]});
    if (balances[p] < 0) debtors.push({name: p, amt: -balances[p]});
  }

  let result = document.getElementById("settlement");
  result.innerHTML = "";

  creditors.forEach(c => {
    debtors.forEach(d => {
      let min = Math.min(c.amt, d.amt);
      if (min > 0) {
        result.innerHTML += `<li>${d.name} pays ₹${min.toFixed(2)} to ${c.name}</li>`;
        c.amt -= min;
        d.amt -= min;
      }
    });
  });
}