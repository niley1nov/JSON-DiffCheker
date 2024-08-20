class DiffChecker {
    constructor(obj1, obj2) {
        this.obj1 = obj1;
        this.obj2 = obj2;
    }

    compare() {
        const results = [];
        this.compareObjects(this.obj1, this.obj2, results, []);
        return results;
    }

    compareObjects(obj1, obj2, results, path) {
        const keys1 = obj1 ? Object.keys(obj1) : [];
        const keys2 = obj2 ? Object.keys(obj2) : [];
        const allKeys = new Set([...keys1, ...keys2]);

        allKeys.forEach(key => {
            const newPath = path.concat([key]);
            const value1 = obj1 && key in obj1 ? obj1[key] : undefined;
            const value2 = obj2 && key in obj2 ? obj2[key] : undefined;

            if (typeof value1 === "object" && typeof value2 === "object" && value1 !== null && value2 !== null) {
                this.compareObjects(value1, value2, results, newPath);
            } else if (Array.isArray(value1) && Array.isArray(value2)) {
                if (value1.length !== value2.length) {
                    results.push({ path: newPath.join('.'), result1: `Array length ${value1.length}`, result2: `Array length ${value2.length}` });
                }
            } else {
                if (value1 !== value2) {
                    const formattedResult1 = value1 !== undefined ? `${newPath.join('.')}: ${JSON.stringify(value1)}` : '';
                    const formattedResult2 = value2 !== undefined ? `${newPath.join('.')}: ${JSON.stringify(value2)}` : '';
                    results.push({ path: newPath.join('.'), result1: formattedResult1, result2: formattedResult2 });
                }
            }
        });
    }
}

function compareJson() {
    const inputBox1 = document.getElementById('jsonInput1');
    const inputBox2 = document.getElementById('jsonInput2');
    inputBox1.classList.remove('error');
    inputBox2.classList.remove('error');
    const json1 = inputBox1.value;
    const json2 = inputBox2.value;
    const tbody = document.getElementById('comparisonResults');
    tbody.innerHTML = '';

    let obj1, obj2;
    try {
        obj1 = JSON.parse(json1);
    } catch (e) {
        displayError('jsonInput1', 'Error parsing JSON 1: ' + e.message);
    }
    try {
        obj2 = JSON.parse(json2);
    } catch (e) {
        displayError('jsonInput2', 'Error parsing JSON 2: ' + e.message);
        return;
    }

    try {
        const diffChecker = new DiffChecker(obj1, obj2);
        const differences = diffChecker.compare();
        differences.forEach(diff => {
            const row = document.createElement('tr');
            const cell1 = document.createElement('td');
            const cell2 = document.createElement('td');
            cell1.innerHTML = diff.result1;
            cell2.innerHTML = diff.result2;
            if (cell1.innerHTML || cell2.innerHTML) {
                row.appendChild(cell1);
                row.appendChild(cell2);
                tbody.appendChild(row);
            }
        });
    } catch (e) {
        displayError(null, 'An error occurred during comparison: ' + e.message); 
    }
}

function displayError(inputId, message) {
    const errorRow = document.createElement('tr');
    const errorCell = document.createElement('td');
    errorCell.colSpan = 2;
    errorCell.textContent = message;
    errorRow.appendChild(errorCell);
    document.getElementById('comparisonResults').appendChild(errorRow);

    if(!!inputId) {
        const errorInput = document.getElementById(inputId);
        errorInput.classList.add('error');
    }
}
