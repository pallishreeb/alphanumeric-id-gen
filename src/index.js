class IDGenerator {
    constructor(prefix, numericLength, startIncrement) {
        // Validate prefix length (ensure it's either 2 or 3 characters)
        if (!prefix || prefix.length < 2 || prefix.length > 3) {
            throw new Error('Prefix must be 2 or 3 characters long.');
        }

        // Validate numericLength (ensure it's a number between 1 and 6 digits)
        if (!numericLength || numericLength < 1 || numericLength > 6) {
            throw new Error('Numeric length must be between 1 and 6 digits');
        }

        this.prefix = prefix;
        this.numericLength = numericLength; // Store the actual numeric length
        this.currentID = startIncrement - 1;
    }

    // Get Last ID
    getLastID() {
        const paddedNumber = String(this.currentID).padStart(this.numericLength, '0');
        return `${this.prefix}${paddedNumber}`;
    }

    // Get Next ID
    getNextID() {
        this.currentID++;
        return this.getLastID();
    }

    // Set Last ID
    setLastID(lastID) {
        const regex = new RegExp(`^${this.prefix}(\\d{${this.numericLength}})$`);
        const match = regex.exec(lastID);
        if (!match) {
            throw new Error(`Invalid ID format. Expected format: ${this.prefix}${'0'.repeat(this.numericLength)}`);
        }
        this.currentID = parseInt(match[1], 10);
    }
}

module.exports = (prefix, numericLength, startIncrement) => {
    return new IDGenerator(prefix, numericLength, startIncrement);
};
