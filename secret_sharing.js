const fs = require('fs');

// Function to decode the y value from a given base to decimal
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation and find f(0) (the constant term)
function lagrangeInterpolation(points) {
    let secret = 0;
    let k = points.length;

    for (let i = 0; i < k; i++) {
        let term = points[i].y; // y_i
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= (0 - points[j].x) / (points[i].x - points[j].x);
            }
        }
        secret += term;
    }
    return Math.round(secret); // Return rounded value to handle any floating-point precision issues
}

// Main function to read the JSON, decode values, and calculate the secret
function findSecret(fileName) {
    // Load and parse the JSON file
    const data = fs.readFileSync(fileName);
    const json = JSON.parse(data);

    // Parse n and k
    const n = json.keys.n;
    const k = json.keys.k;

    // Parse and decode the points
    const points = [];
    for (let i = 1; i <= n; i++) {
        const key = i.toString();
        if (json[key]) {
            const base = parseInt(json[key].base);
            const value = json[key].value;
            const decodedValue = decodeValue(value, base);
            
            // Print x, encoded y, and decoded y values
            //console.log(`x: ${i}, encoded y: ${value}, decoded y: ${decodedValue}`);
            
            points.push({ x: i, y: decodedValue });
        }
    }

    // Ensure we have at least k points
    if (points.length < k) {
        console.error("Not enough points provided for interpolation.");
        return;
    }

    // Use the first k points for interpolation
    const selectedPoints = points.slice(0, k);

    // Find the secret (constant term) using Lagrange interpolation
    const secret = lagrangeInterpolation(selectedPoints);

    // Output the secret
    console.log(`The secret (constant term) is: ${secret}`);
}

// Test the function with the given test case JSON
findSecret('testcase1.json');  // Change this to 'testcase2.json' for the second test case
findSecret('testcase2.json');