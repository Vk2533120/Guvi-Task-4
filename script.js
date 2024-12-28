document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("entry-form");
    const entryList = document.getElementById("entry-list");
    const totalIncomeElem = document.getElementById("total-income");
    const totalExpensesElem = document.getElementById("total-expenses");
    const netBalanceElem = document.getElementById("net-balance");

    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    function updateUI() {
        entryList.innerHTML = ""; 
        let totalIncome = 0,
            totalExpenses = 0;

        entries.forEach((entry, index) => {
            if (shouldDisplay(entry)) {
                const li = document.createElement("li");
                li.classList.add("entry-card"); 
                li.innerHTML = `
                    <span class="entry-description">${entry.description}</span>
                    <span class="entry-amount ${entry.type === "income" ? "income" : "expense"}">
                        ${entry.type === "income" ? "+" : "-"}₹${entry.amount.toFixed(2)}
                    </span>
                    <button class="btn-edit" onclick="editEntry(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteEntry(${index})">Delete</button>
                `;
                entryList.appendChild(li);
            }

            if (entry.type === "income") {
                totalIncome += entry.amount;
            } else {
                totalExpenses += entry.amount;
            }
        });

        totalIncomeElem.textContent = totalIncome.toFixed(2);
        totalExpensesElem.textContent = totalExpenses.toFixed(2);
        netBalanceElem.textContent = (totalIncome - totalExpenses).toFixed(2);

        localStorage.setItem("entries", JSON.stringify(entries));
    }

    function shouldDisplay(entry) {
        const filterValue = document.querySelector(".filters input:checked").value;
        return filterValue === "all" || filterValue === entry.type;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 

        const description = document.getElementById("description").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;

        if (description && !isNaN(amount) && amount > 0) {
            entries.push({ description, amount, type }); 
            updateUI(); 
            form.reset(); 
        } else {
            alert("Please enter valid details.");
        }
    });

    window.editEntry = (index) => {
        const entry = entries[index];
        document.getElementById("description").value = entry.description;
        document.getElementById("amount").value = entry.amount;
        document.getElementById("type").value = entry.type;

        entries.splice(index, 1); 
        updateUI(); 
    };

    window.deleteEntry = (index) => {
        if (confirm("Are you sure you want to delete this entry?")) {
            entries.splice(index, 1); 
            updateUI(); 
        }
    };

    const filters = document.querySelectorAll(".filters input");
    filters.forEach((filter) =>
        filter.addEventListener("change", updateUI)
    );

    updateUI();
});
