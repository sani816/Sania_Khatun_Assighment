let members = [];
let balances = {};
let expenses = [];

/* ✅ ADD MEMBER */
function addMember() {
  let name = document.getElementById("memberName").value.trim();

  if (!name) {
    alert("Enter member name");
    return;
  }

  if (members.includes(name)) {
    alert("Member already exists!");
    return;
  }

  members.push(name);
  balances[name] = 0;

  updateMembers();
  document.getElementById("memberName").value = "";
}

/* ✅ DELETE MEMBER */
function deleteMember(name) {
  members = members.filter(m => m !== name);
  delete balances[name];

  updateMembers();
  updateBalances();
  calculateSettlement();
}

/* ✅ UPDATE MEMBERS UI */
function updateMembers() {
  let list = document.getElementById("membersList");
  let paidBy = document.getElementById("paidBy");
  let customDiv = document.getElementById("customInputs");

  list.innerHTML = "";
  paidBy.innerHTML = "";
  customDiv.innerHTML = "";

  members.forEach(m => {
    list.innerHTML += `
      <li>
        ${m}
        <button onclick="deleteMember('${m}')">❌</button>
      </li>
    `;

    paidBy.innerHTML += `<option>${m}</option>`;

    customDiv.innerHTML += `
      <input type="number" placeholder="${m} amount" id="custom-${m}">
    `;
  });
}

/* ✅ ADD EXPENSE */
function addExpense() {
  let desc = document.getElementById("desc").value.trim();
  let amount = parseFloat(document.getElementById("amount").value);
  let payer = document.getElementById("paidBy").value;
  let type = document.getElementById("splitType").value;

  if (!desc || !amount || members.length === 0) {
    alert("Please fill all fields properly!");
    return;
  }

  if (!payer) {
    alert("Select who paid!");
    return;
  }

  if (type === "equal") {
    let split = amount / members.length;

    members.forEach(m => {
      if (m === payer) balances[m] += amount - split;
      else balances[m] -= split;
    });

  } else {
    let totalCustom = 0;

    members.forEach(m => {
      let val = parseFloat(document.getElementById(`custom-${m}`).value) || 0;
      totalCustom += val;
    });

    if (totalCustom !== amount) {
      alert("Custom split must equal total amount!");
      return;
    }

    members.forEach(m => {
      let val = parseFloat(document.getElementById(`custom-${m}`).value) || 0;

      if (m === payer) balances[m] += amount - val;
      else balances[m] -= val;
    });
  }

  updateBalances();
  calculateSettlement();

  /* 🔄 RESET INPUTS */
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("splitType").value = "equal";
  document.getElementById("customInputs").style.display = "none";

  // clear custom inputs
  members.forEach(m => {
    let el = document.getElementById(`custom-${m}`);
    if (el) el.value = "";
  });
}

/* ✅ UPDATE BALANCES */
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

/* ✅ TOGGLE CUSTOM INPUT */
function toggleCustom() {
  let type = document.getElementById("splitType").value;
  let div = document.getElementById("customInputs");

  div.style.display = type === "custom" ? "block" : "none";
}

/* ✅ SETTLEMENT CALCULATION */
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
        result.innerHTML += `
          <li>${d.name} pays ₹${min.toFixed(2)} to ${c.name}</li>
        `;
        c.amt -= min;
        d.amt -= min;
      }
    });
  });
}

/* ✅ RESET ALL (OPTIONAL BUTTON) */
function resetAll() {
  members = [];
  balances = {};
  expenses = [];

  document.getElementById("membersList").innerHTML = "";
  document.getElementById("balances").innerHTML = "";
  document.getElementById("settlement").innerHTML = "";
  document.getElementById("paidBy").innerHTML = "";
  document.getElementById("customInputs").innerHTML = "";

  document.getElementById("groupName").value = "";
  document.getElementById("memberName").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}
