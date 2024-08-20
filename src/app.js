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
    const json1 = document.getElementById('jsonInput1').value;
    const json2 = document.getElementById('jsonInput2').value;
    const tbody = document.getElementById('comparisonResults');
    tbody.innerHTML = '';
    try {
        const obj1 = JSON.parse(json1);
        const obj2 = JSON.parse(json2);
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
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2;
        cell.textContent = 'Error parsing JSON: ' + e.message;
        tbody.appendChild(row);
    }
}
