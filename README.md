Alphanumeric ID Generator

A simple and customizable alphanumeric ID generator for developers. This package is ideal for generating unique IDs with a prefix and numeric part that auto-increments. It is especially useful for database systems and distributed applications.

Features
Generate custom alphanumeric IDs with user-defined prefixes.
Specify the numeric length for IDs (e.g., PB00001 or INV001).
Supports fetching the last generated ID and generating the next ID.
Easy integration with databases like MongoDB for ID tracking.
Lightweight and flexible.


Installation

Install the package via npm:
npm install alphanumeric-id-gen


Usage
Basic Example:
const idGenerator = require('alphanumeric-id-gen');

// Initialize the generator with:
// Prefix: 'PB', Numeric Length: 5, Starting Increment: 1
```
const generator = idGenerator('PB', 5, 1);
```
// Generate the first ID
```
console.log(generator.getNextID()); // Output: PB00001
```

// Generate the next ID
```
console.log(generator.getNextID()); // Output: PB00002
```

// Fetch the last generated ID
```
console.log(generator.getLastID()); // Output: PB00003
```

// Set a custom last ID
```
generator.setLastID('PB00100');
console.log(generator.getNextID()); // Output: PB00101
```

Using with MongoDB
To integrate this package with MongoDB for tracking IDs:

Use the following code to generate and track IDs.

Code Example:
```
const { MongoClient } = require('mongodb');
const idGenerator = require('alphanumeric-id-gen');

// MongoDB connection setup
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function generateNextID(collection, prefix, numericLength, startIncrement = 1) {
  // Initialize the generator
  const generator = idGenerator(prefix, numericLength, startIncrement);

  // Find the document with the highest productID for the given prefix
  const lastDoc = await collection
    .find({ productID: { $regex: ^${prefix}\\d+$ } })
    .sort({ productID: -1 })
    .limit(1)
    .toArray();

  if (lastDoc.length > 0) {
    // Extract the last numeric part
    const lastID = lastDoc[0].productID;
    generator.setLastID(lastID);
  }

  // Generate the next ID
  return generator.getNextID();
}

async function addProduct(name, category, prefix, numericLength) {
  const db = client.db('your_database_name');
  const productsCollection = db.collection('products');

  // Generate the next productID
  const productID = await generateNextID(productsCollection, prefix, numericLength);

  // Insert the product with the generated productID
  const newProduct = {
    name,
    category,
    productID,
    createdAt: new Date(),
  };

  const result = await productsCollection.insertOne(newProduct);
  return result.insertedId;
}

// Example usage
(async () => {
  try {
    await client.connect();

    // Add a product with an autogenerated ID
    const productID1 = await addProduct('Laptop', 'Electronics', 'PROD', 5);
    console.log(Added product with ID: ${productID1});

    const productID2 = await addProduct('Smartphone', 'Electronics', 'PROD', 5);
    console.log(Added product with ID: ${productID2});
  } finally {
    await client.close();
  }
})();
```
Benefits of This Approach
No Separate Tracking Collection: All IDs are stored within the same collection under productID.
Atomic Operations: The ID generation process is based on querying the same collection, ensuring no race conditions.
Ease of Use: Users only need to provide the prefix and numeric length; the rest is automated.

Using with SQL Database
To integrate this package with MySQL for tracking IDs:

Use the following code to generate and track IDs.

Code Example:
```
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    productID VARCHAR(255) UNIQUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


const mysql = require('mysql2/promise');
const idGenerator = require('alphanumeric-id-gen');

// MySQL connection setup
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'your_database_name',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function generateNextID(connection, tableName, columnName, prefix, numericLength) {
  // Initialize the generator
  const generator = idGenerator(prefix, numericLength, 1);

  // Fetch the highest productID for the given prefix
  const [rows] = await connection.query(
    SELECT ${columnName} FROM ${tableName} WHERE ${columnName} LIKE ? ORDER BY ${columnName} DESC LIMIT 1,
    [${prefix}%]
  );

  if (rows.length > 0) {
    const lastID = rows[0][columnName];
    generator.setLastID(lastID);
  }

  // Generate the next ID
  return generator.getNextID();
}

async function addProduct(name, category, prefix, numericLength) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Generate the next productID
    const productID = await generateNextID(connection, 'products', 'productID', prefix, numericLength);

    // Insert the product into the table
    const [result] = await connection.query(
      INSERT INTO products (name, category, productID) VALUES (?, ?, ?),
      [name, category, productID]
    );

    await connection.commit();

    return { id: result.insertId, productID };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}



// Example usage
(async () => {
  try {
    // Add a product with an autogenerated ID
    const product1 = await addProduct('Laptop', 'Electronics', 'PROD', 5);
    console.log(Added product: ${JSON.stringify(product1)}); // e.g., { id: 1, productID: 'PROD00001' }

    const product2 = await addProduct('Smartphone', 'Electronics', 'PROD', 5);
    console.log(Added product: ${JSON.stringify(product2)}); // e.g., { id: 2, productID: 'PROD00002' }
  } catch (error) {
    console.error('Error adding product:', error);
  } finally {
    await pool.end();
  }
})();
```
Why This is Useful for SQL Users
Custom ID Control: While SQL supports AUTO_INCREMENT, this approach provides human-readable alphanumeric IDs with custom prefixes.
Database Independence: Works with any SQL database that supports basic queries.
Scalable: Tracks IDs directly within the table without needing a separate tracking mechanism.



API Reference
idGenerator(prefix, numericLength, startIncrement)
Creates a new instance of the ID generator.

prefix: string (2 or 3 characters) – The prefix for the generated ID.
numericLength: number – The length of the numeric part (e.g., 5 for PB00001).
startIncrement: number – The starting numeric value for the generator.

Methods
getNextID()
Description: Generates the next alphanumeric ID.
Returns: string – The next ID.
getLastID()
Description: Fetches the last generated ID.
Returns: string – The last ID.
setLastID(lastID)
Description: Sets a custom last ID.
Parameters: lastID (string) – The ID to set as the last generated ID.
Returns: None.

Contributing
We welcome contributions to improve this package. Please open an issue or submit a pull request on the GitHub repository.
https://github.com/pallishreeb/alphanumeric-id-gen

